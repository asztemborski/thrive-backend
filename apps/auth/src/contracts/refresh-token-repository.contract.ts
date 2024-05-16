import { RefreshToken } from '../domain/entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  insert(refreshToken: RefreshToken): Promise<void>;
}
