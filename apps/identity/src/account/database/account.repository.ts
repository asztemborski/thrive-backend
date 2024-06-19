import { Inject, Injectable } from '@nestjs/common';
import { eq, or } from 'drizzle-orm';

import { DATABASE_CLIENT } from '@libs/database';
import { IAccountMapper, IAccountRepository } from '../contracts';
import { Account } from '../domain/account.entity';
import { Database } from './index';
import { accounts } from './account.schema';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @Inject(DATABASE_CLIENT) private readonly database: Database,
    @Inject(IAccountMapper) private readonly accountMapper: IAccountMapper,
  ) {}

  async getById(id: string): Promise<Account | undefined> {
    const account = await this.database.query.accounts.findFirst({
      where: (account) => eq(account.id, id),
    });

    return account && this.accountMapper.toDomain(account);
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const account = await this.database.query.accounts.findFirst({
      where: (account) => eq(account.emailAddress, email),
    });

    return account && this.accountMapper.toDomain(account);
  }

  async insert(account: Account): Promise<void> {
    const accountSchema = this.accountMapper.toPersistence(account);
    await this.database.insert(accounts).values(accountSchema);
  }

  async isUnique(email: string, username: string): Promise<[emailUnique: boolean, usernameUnique: boolean]> {
    const account = await this.database.query.accounts.findFirst({
      where: (account) => or(eq(account.emailAddress, email), eq(account.username, username)),
    });

    return account ? [account.emailAddress !== email, account.username !== username] : [true, true];
  }
}
