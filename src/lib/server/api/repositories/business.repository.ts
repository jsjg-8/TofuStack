import { inject, injectable } from 'tsyringe';
import { businessTable } from '../databases/postgres/tables';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { takeFirstOrThrow } from '../common/utils/repository';
import { DrizzleService } from '../services/drizzle.service';

export type CreateBusiness = InferInsertModel<typeof businessTable>;
export type UpdateBusiness = Partial<CreateBusiness>;

@injectable()
export class BusinessesRepository {
	constructor(@inject(DrizzleService) private drizzle: DrizzleService) {}

	// **Single Business Retrieval**
	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.businessTable.findFirst({
			where: eq(businessTable.id, id)
		});
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const business = await this.findOneById(id, db);
		if (!business) throw Error('Business not found');
		return business;
	}

	// **Find Businesses by User ID**
	async findManyByUserId(userId: string, db = this.drizzle.db) {
		return db.query.businessTable.findMany({
			where: eq(businessTable.userId, userId)
		});
	}

	// **Business Creation**
	async create(data: CreateBusiness, db = this.drizzle.db) {
		return db.insert(businessTable).values(data).returning().then(takeFirstOrThrow);
	}

	// **Update Business**
	async update(id: string, data: UpdateBusiness, db = this.drizzle.db) {
		return db
			.update(businessTable)
			.set(data)
			.where(eq(businessTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}

	// **Delete Business**
	async delete(id: string, db = this.drizzle.db) {
		return db.delete(businessTable).where(eq(businessTable.id, id)).execute();
	}
}
