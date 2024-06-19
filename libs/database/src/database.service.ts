import { Injectable } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';

import { DatabaseConfig, DatabaseSchema } from '@libs/database/database.config';

export interface IDatabaseService {
  getClient(config: DatabaseConfig): PostgresJsDatabase<DatabaseSchema>;
}

@Injectable()
export class DatabaseService implements IDatabaseService {
  getClient(config: DatabaseConfig): PostgresJsDatabase<DatabaseSchema> {
    const queryClient = postgres(config.connectionUrl ?? '', config.connectionConfig);
    return drizzle(queryClient, config.options);
  }
}
