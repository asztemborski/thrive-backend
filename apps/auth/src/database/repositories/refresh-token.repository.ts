import { Inject, Injectable } from '@nestjs/common';

import { DATABASE_CLIENT } from '@libs/database';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenMapper } from '../../services/refresh-token-mapper';
import { REFRESH_TOKEN_MAPPER } from '../../auth.di-tokens';
import { IRefreshTokenRepository } from '../../contracts';
import { Database, refreshTokens } from '../schemas';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @Inject(REFRESH_TOKEN_MAPPER) private readonly refreshTokenMapper: RefreshTokenMapper,
    @Inject(DATABASE_CLIENT) private readonly database: Database,
  ) {}

  async insert(refreshToken: RefreshToken): Promise<void> {
    await this.database
      .insert(refreshTokens)
      .values(this.refreshTokenMapper.toPersistence(refreshToken));
  }
}
