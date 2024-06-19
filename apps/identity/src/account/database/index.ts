import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import * as accountSchema from './account.schema';
import { Provider } from '@nestjs/common';
import { IAccountRepository } from '../contracts';
import { AccountRepository } from './account.repository';

type DatabaseSchema = typeof accountSchema;

export type Database = PostgresJsDatabase<DatabaseSchema>;

export const schema = { ...accountSchema };

export const repositoryProviders: Provider[] = [
  {
    provide: IAccountRepository,
    useClass: AccountRepository,
  },
];
