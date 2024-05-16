import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as userSchema from './user.schema';
import * as refreshTokenSchema from './refresh-token.schema';

export * from './user.schema';
export * from './refresh-token.schema';

type DatabaseSchema = typeof userSchema & typeof refreshTokenSchema;

export type Database = PostgresJsDatabase<DatabaseSchema>;

export const schema = { ...userSchema, ...refreshTokenSchema };
