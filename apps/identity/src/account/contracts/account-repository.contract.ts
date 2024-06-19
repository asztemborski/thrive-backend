import { Account } from '../domain/account.entity';

export const IAccountRepository = Symbol('__IDENTITY_ACCOUNT_REPOSITORY__');

export interface IAccountRepository {
  getById(id: string): Promise<Account | undefined>;
  getByEmail(email: string): Promise<Account | undefined>;
  insert(account: Account): Promise<void>;
  isUnique(email: string, username: string): Promise<[emailUnique: boolean, usernameUnique: boolean]>;
}
