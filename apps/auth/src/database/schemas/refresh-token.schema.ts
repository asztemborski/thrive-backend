import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { users } from './user.schema';

export const refreshTokens = pgTable('refresh_tokens', {
  token: varchar('token').notNull().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export type RefreshTokenSchema = typeof refreshTokens.$inferSelect;
export type RefreshTokenInsertSchema = typeof refreshTokens.$inferInsert;
