import { pgTable, text, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from './users.table';
import { timestamps } from '../../../common/utils/table';
import { createId } from '@paralleldrive/cuid2';
import { subscriptionsTable } from './subscriptions.table';

export const paymentsTable = pgTable('payments', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	subscriptionId: text('subscription_id')
		.notNull()
		.references(() => subscriptionsTable.id, { onDelete: 'cascade' }),
	amount: integer('amount').notNull(), // Stored in minor units (e.g., cents for USD)
	currency: text('currency').default('USD'), // ISO currency code
	status: pgEnum('payment_status', ['completed', 'failed', 'pending', 'refunded'])(
		'status'
	).notNull(), // Enum for status
	transactionId: text('transaction_id'), // Reference to the external payment processor transaction ID
	...timestamps
});

// Payment Relations
export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [paymentsTable.userId],
		references: [usersTable.id]
	}),
	subscription: one(subscriptionsTable, {
		fields: [paymentsTable.subscriptionId],
		references: [subscriptionsTable.id]
	})
}));
