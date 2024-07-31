import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';

import { REDIS_CLIENT } from '@libs/redis/redis.di-tokens';
import { Account } from '../../account/domain/account.entity';
import { ITokenService } from '../contracts';
import { AuthTokensDto } from '../dtos';
import { AuthConfig } from '../config/auth.config';

@Injectable()
export class TokensService implements ITokenService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly jwtService: JwtService,
    private readonly config: AuthConfig,
  ) {}

  async generateAccess(account: Account): Promise<AuthTokensDto> {
    const claims = {
      id: account.id,
      username: account.username,
      email: account.email.address,
    };

    const accessToken = await this.jwtService.signAsync(claims, {
      secret: this.config.accessTokenSecretKey,
      expiresIn: this.config.accessTokenExpirationTime,
    });

    const refreshToken = await this.jwtService.signAsync(claims, {
      secret: this.config.refreshTokenSecretKey,
      expiresIn: this.config.refreshTokenExpirationTime,
    });

    const refreshTokenExpiration = ms(this.config.refreshTokenExpirationTime);
    await this.redis.set(refreshToken, account.id, 'PX', refreshTokenExpiration);

    return { accessToken, refreshToken };
  }

  async generateEmailVerificationToken(account: Account): Promise<string> {
    const emailVerificationTokenExpiration = ms(this.config.emailVerificationTokenExpirationTime);
    const token = uuid();

    await this.redis.set(`email-verification-${token}`, account.id, 'PX', emailVerificationTokenExpiration);
    return token;
  }
}
