import { Options, PostgresType } from 'postgres';
import { DrizzleConfig } from 'drizzle-orm';

export type DatabaseSchema = { [key: string]: unknown };

export type PostgresConfig = Options<{ [key: string]: PostgresType }>;

export interface DatabaseConfig {
  readonly connectionUrl?: string;
  readonly connectionConfig?: PostgresConfig;
  readonly options?: DrizzleConfig<DatabaseSchema>;
}
