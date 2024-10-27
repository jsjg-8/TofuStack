import { inject, injectable } from 'tsyringe';
import { listingsTable } from '../databases/postgres/tables';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { takeFirstOrThrow } from '../common/utils/repository';
import { DrizzleService } from '../services/drizzle.service';

export type CreateListing = InferInsertModel<typeof listingsTable>;
export type UpdateListing = Partial<CreateListing>;

@injectable()
export class ListingsRepository {
	constructor(@inject(DrizzleService) private drizzle: DrizzleService) {}

	// **Single Listing Retrieval**
	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.listingsTable.findFirst({
			where: eq(listingsTable.id, id)
		});
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const listing = await this.findOneById(id, db);
		if (!listing) throw Error('Listing not found');
		return listing;
	}

	// **Find Listings by User ID**
	async findManyByUserId(userId: string, db = this.drizzle.db) {
		return db.query.listingsTable.findMany({
			where: eq(listingsTable.businessId, userId)
		});
	}

	// **Listing Creation**
	async create(data: CreateListing, db = this.drizzle.db) {
		return db.insert(listingsTable).values(data).returning().then(takeFirstOrThrow);
	}

	// **Update Listing**
	async update(id: string, data: UpdateListing, db = this.drizzle.db) {
		return db
			.update(listingsTable)
			.set(data)
			.where(eq(listingsTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}

	// **Delete Listing**
	async delete(id: string, db = this.drizzle.db) {
		return db.delete(listingsTable).where(eq(listingsTable.id, id)).execute();
	}
}
