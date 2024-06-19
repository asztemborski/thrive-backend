import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  emailAddress: varchar('email_address').notNull().unique(),
  emailConfirmed: boolean('email_confirmed').notNull(),
  username: varchar('username').notNull().unique(),
  password: varchar('password_hash').notNull(),
});

export type AccountSchema = InferSelectModel<typeof accounts>;
