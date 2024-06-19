import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import ms from 'ms';

import { Account } from '../../account/domain/account.entity';
import { ITokenService } from '../contracts';
import { AuthTokensDto } from '../dtos';
import { AuthConfig } from '../config/auth.config';
import { REDIS_CLIENT } from '@libs/redis/redis.di-tokens';
import { IAccountRepository } from '../../account/contracts';
import { UnauthorizedException } from '../exceptions';

@Injectable()
export class TokensService implements ITokenService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(IAccountRepository) private readonly accountRepository: IAccountRepository,
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

  async refreshAccess(token: string): Promise<AuthTokensDto> {
    const accountId = await this.redis.getdel(token);

    if (!accountId) {
      throw new UnauthorizedException();
    }

    const account = await this.accountRepository.getById(accountId);

    if (!account) {
      throw new UnauthorizedException();
    }

    return this.generateAccess(account);
  }
}
