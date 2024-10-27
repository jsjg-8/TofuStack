import { inject, injectable } from 'tsyringe';
import { qrTable } from '../databases/postgres/tables';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { takeFirstOrThrow } from '../common/utils/repository';
import { DrizzleService } from '../services/drizzle.service';

export type CreateQrCode = InferInsertModel<typeof qrTable>;
export type UpdateQrCode = Partial<CreateQrCode>;

@injectable()
export class QrCodesRepository {
	constructor(@inject(DrizzleService) private drizzle: DrizzleService) {}

	// **Single QR Code Retrieval**
	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.qrTable.findFirst({
			where: eq(qrTable.id, id)
		});
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const qrCode = await this.findOneById(id, db);
		if (!qrCode) throw new Error('QR Code not found');
		return qrCode;
	}

	// **Find QR Codes by User ID**
	async findManyByBusinessId(businessId: string, db = this.drizzle.db) {
		return db.query.qrTable.findMany({
			where: eq(qrTable.businessId, businessId)
		});
	}

	// **Create QR Code**
	async create(data: CreateQrCode, db = this.drizzle.db) {
		return db.insert(qrTable).values(data).returning().then(takeFirstOrThrow);
	}

	// **Update QR Code**
	async update(id: string, data: UpdateQrCode, db = this.drizzle.db) {
		return db
			.update(qrTable)
			.set(data)
			.where(eq(qrTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}

	// **Delete QR Code**
	async delete(id: string, db = this.drizzle.db) {
		return db.delete(qrTable).where(eq(qrTable.id, id)).execute();
	}
}
