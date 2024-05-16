import { Inject, Injectable } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';

import { DatabaseConfig, DatabaseSchema } from '@libs/database/database.config';
import { DATABASE_CONFIG } from '@libs/database/database.di-tokens';

export interface IDatabaseService {
  getClient(): PostgresJsDatabase<DatabaseSchema>;
}

@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor(@Inject(DATABASE_CONFIG) private readonly config: DatabaseConfig) {}

  getClient(): PostgresJsDatabase<DatabaseSchema> {
    const queryClient = postgres(this.config.connectionUrl, this.config.connectionConfig);
    return drizzle(queryClient, this.config.options);
  }
}
