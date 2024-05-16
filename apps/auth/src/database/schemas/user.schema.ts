import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel, relations } from 'drizzle-orm';

import { refreshTokens, RefreshTokenSchema } from './refresh-token.schema';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  emailAddress: varchar('email_address').unique(),
  emailConfirmed: boolean('email_confirmed'),
  username: varchar('username').unique(),
  password: varchar('password_hash'),
});

export const userRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
}));

export type UserSchema = InferSelectModel<typeof users> & {
  refreshTokens: RefreshTokenSchema[];
};
