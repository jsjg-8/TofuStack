import { pgTable, text, timestamp, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { cuid2, timestamps } from '../../../common/utils/table';
import { createId } from '@paralleldrive/cuid2';
import { businessTable } from './business.table';

export const listingsTable = pgTable('listings', {
	id: cuid2('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	businessId: text('business_id')
		.notNull()
		.references(() => businessTable.id, { onDelete: 'cascade' }),
	title: varchar('title', { length: 100 }).notNull(),
	description: text('description').notNull(),
	category: varchar('category', { length: 50 }).notNull(),
	price: integer('price').notNull(),
	currency: varchar('currency', { length: 3 }).default('USD'),
	available: boolean('available').default(true),
	...timestamps
});

export const listingsRelations = relations(listingsTable, ({ one }) => ({
	business: one(businessTable, {
		fields: [listingsTable.businessId],
		references: [businessTable.id]
	})
}));
