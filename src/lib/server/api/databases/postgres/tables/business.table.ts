import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { timestamps } from '../../../common/utils/table';
import { usersTable } from './users.table';

export const businessTable = pgTable('business', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	userId: text('owner_id').references(() => usersTable.id),
	name: varchar('name').notNull(),
	description: text('description'),
	location: text('location').notNull(),
	contactEmail: varchar('contact_email').notNull(),
	contactPhone: varchar('contact_phone'),
	...timestamps
});

export const businessRelations = relations(businessTable, ({ one }) => ({
	owner: one(usersTable, {
		fields: [businessTable.userId],
		references: [usersTable.id]
	})
}));
