import { Mapper } from '@libs/ddd';
import { Account } from '../domain/account.entity';
import { AccountSchema } from '../database/account.schema';

export const IAccountMapper = Symbol('__IDENTITY_ACCOUNT_MAPPER__');

export interface IAccountMapper extends Mapper<Account, AccountSchema> {}
