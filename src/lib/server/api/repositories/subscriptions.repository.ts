import { inject, injectable } from 'tsyringe';
import { subscriptionsTable } from '../databases/postgres/tables';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { takeFirstOrThrow } from '../common/utils/repository';
import { DrizzleService } from '../services/drizzle.service';

export type CreateSubscription = InferInsertModel<typeof subscriptionsTable>;
export type UpdateSubscription = Partial<CreateSubscription>;

@injectable()
export class SubscriptionsRepository {
	constructor(@inject(DrizzleService) private drizzle: DrizzleService) {}

	// **Single Subscription Retrieval**
	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.subscriptionsTable.findFirst({
			where: eq(subscriptionsTable.id, id)
		});
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const subscription = await this.findOneById(id, db);
		if (!subscription) throw new Error('Subscription not found');
		return subscription;
	}

	// **Find Subscriptions by User ID**
	async findManyByUserId(userId: string, db = this.drizzle.db) {
		return db.query.subscriptionsTable.findMany({
			where: eq(subscriptionsTable.userId, userId)
		});
	}

	// **Create Subscription**
	async create(data: CreateSubscription, db = this.drizzle.db) {
		return db.insert(subscriptionsTable).values(data).returning().then(takeFirstOrThrow);
	}

	// **Update Subscription**
	async update(id: string, data: UpdateSubscription, db = this.drizzle.db) {
		return db
			.update(subscriptionsTable)
			.set(data)
			.where(eq(subscriptionsTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}

	// **Delete Subscription**
	async delete(id: string, db = this.drizzle.db) {
		return db.delete(subscriptionsTable).where(eq(subscriptionsTable.id, id)).execute();
	}
}
