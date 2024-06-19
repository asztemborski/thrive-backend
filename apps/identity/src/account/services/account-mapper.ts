import { Injectable } from '@nestjs/common';

import { IAccountMapper } from '../contracts';
import { Account } from '../domain/account.entity';
import { AccountSchema } from '../database/account.schema';
import { Email } from '../domain/email.value-object';
import { Username } from '../domain/username.value-object';

@Injectable()
export class AccountMapper implements IAccountMapper {
  toDomain(schema: AccountSchema): Account {
    return new Account({
      ...schema,
      email: new Email({ address: schema.emailAddress, isConfirmed: schema.emailConfirmed }),
      username: new Username({ value: schema.username }),
    });
  }

  toPersistence(entity: Account): AccountSchema {
    const account = entity.getProperties();
    return {
      ...account,
      emailAddress: account.email.address,
      emailConfirmed: account.email.isConfirmed,
      username: account.username.value,
    };
  }
}
