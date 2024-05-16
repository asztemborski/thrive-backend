import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

import { User } from '../domain/entities/user.entity';
import { ITokensService } from '../contracts';
import { AuthTokensDto } from '../dtos';
import { JWT_CONFIG_TOKEN, JwtConfig } from '../config';

@Injectable()
export class TokensService implements ITokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccess(user: User): Promise<AuthTokensDto> {
    const claims = {
      id: user.id,
      username: user.username,
      email: user.email.address,
      emailConfirmed: user.email.isConfirmed,
    };

    const config = this.configService.get<JwtConfig>(JWT_CONFIG_TOKEN);
    const accessToken = await this.jwtService.signAsync(claims, {
      secret: config.accessTokenSecretKey,
      expiresIn: config.accessTokenExpirationTime,
    });

    const refreshToken = await this.jwtService.signAsync(claims, {
      secret: config.refreshTokenSecretKey,
      expiresIn: config.refreshTokenExpirationTime,
    });

    const expirationDate = new Date(Date.now() + ms(config.refreshTokenExpirationTime));
    user.assignRefreshToken(refreshToken, expirationDate);

    return { accessToken, refreshToken };
  }
}
