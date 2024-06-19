import { Account } from '../../account/domain/account.entity';
import { AuthTokensDto } from '../dtos';

export const ITokenService = Symbol('__IDENTITY_TOKEN_SERVICE__');

export interface ITokenService {
  generateAccess(account: Account): Promise<AuthTokensDto>;
  refreshAccess(token: string): Promise<AuthTokensDto>;
}
