import { relations } from 'drizzle-orm';
import { businessTable } from './business.table';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { cuid2, timestamps } from '../../../common/utils/table';

export const qrTable = pgTable('qrcodes', {
	id: cuid2('id').primaryKey(),
	businessId: text('business_id')
		.notNull()
		.references(() => businessTable.id, { onDelete: 'cascade' }),
	menuLink: text('menu_link').notNull(),
	...timestamps
});

export const qrRelations = relations(qrTable, ({ one }) => ({
	business: one(businessTable, {
		fields: [qrTable.businessId],
		references: [businessTable.id]
	})
}));
