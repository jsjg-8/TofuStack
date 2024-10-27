import { relations } from 'drizzle-orm';
import { cuid2 } from '../../../common/utils/table';
import { pgTable, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { usersTable } from './users.table';
import { createId } from '@paralleldrive/cuid2';

export const subscriptionsTable = pgTable('subscriptions', {
	id: cuid2('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	planType: pgEnum('plan', ['basic', 'pro'])('planType'),
	businessLimit: integer('business_limit').notNull(), // Maximum businesses allowed
	expirationDate: timestamp('expiration_date', { withTimezone: true, mode: 'date' }),
	status: pgEnum('subs_status', ['active', 'pending', 'canceled'])('status')
});

// Subscription Relations
export const subscriptionsRelations = relations(subscriptionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [subscriptionsTable.userId],
		references: [usersTable.id]
	})
}));
