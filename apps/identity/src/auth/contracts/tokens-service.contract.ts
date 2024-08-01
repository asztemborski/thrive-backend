import { Account } from '../../account/domain/account.entity';
import { AuthTokensDto, UserClaimsDto } from '../dtos';

export const ITokenService = Symbol('__IDENTITY_TOKEN_SERVICE__');

export interface ITokenService {
  generateAccess(account: Account): Promise<AuthTokensDto>;
  generateEmailVerificationToken(account: Account): Promise<string>;
  revokeRefreshToken(token: string): Promise<string | null>;
  revokeAllRefreshTokens(accountId: string): Promise<void>;
  verify(token: string): Promise<UserClaimsDto>;
}
