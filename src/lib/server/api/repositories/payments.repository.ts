import { inject, injectable } from 'tsyringe';
import { paymentsTable } from '../databases/postgres/tables';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { takeFirstOrThrow } from '../common/utils/repository';
import { DrizzleService } from '../services/drizzle.service';

export type CreatePayment = InferInsertModel<typeof paymentsTable>;
export type UpdatePayment = Partial<CreatePayment>;

@injectable()
export class PaymentsRepository {
	constructor(@inject(DrizzleService) private drizzle: DrizzleService) {}

	// **Single Payment Retrieval**
	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.paymentsTable.findFirst({
			where: eq(paymentsTable.id, id)
		});
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const payment = await this.findOneById(id, db);
		if (!payment) throw new Error('Payment not found');
		return payment;
	}

	// **Find Payments by User ID**
	async findManyByUserId(userId: string, db = this.drizzle.db) {
		return db.query.paymentsTable.findMany({
			where: eq(paymentsTable.userId, userId)
		});
	}

	// **Create Payment**
	async create(data: CreatePayment, db = this.drizzle.db) {
		return db.insert(paymentsTable).values(data).returning().then(takeFirstOrThrow);
	}

	// **Update Payment**
	async update(id: string, data: UpdatePayment, db = this.drizzle.db) {
		return db
			.update(paymentsTable)
			.set(data)
			.where(eq(paymentsTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}

	// **Delete Payment**
	async delete(id: string, db = this.drizzle.db) {
		return db.delete(paymentsTable).where(eq(paymentsTable.id, id)).execute();
	}
}
