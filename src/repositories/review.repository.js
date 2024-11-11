import { pool, prisma } from "../db.config.js";

export class ReviewRepository {
	async checkStoreExists(storeId) {
		const store = await prisma.store.findFirst({
			where: {
				id: storeId, // store_id가 아닌 id 사용
				isActive: true,
			},
		});
		return !!store; // null 체크를 위해 boolean으로 변환
	}

	async checkExistingReview(userId, storeId) {
		const review = await prisma.review.findUnique({
			where: {
				unique_user_store_review: {
					user_id: userId,
					store_id: storeId,
				},
			},
		});
		return !!review; // null 체크를 위해 boolean으로 변환
	}

	async createReview(reviewData) {
		const result = await prisma.review.create({
			data: reviewData,
		});
		if (!result) {
			throw new Error("리뷰 생성에 실패했습니다.");
		}
		return result;
	}

	async getReviewsByuserId(userId) {
		try {
			const reviews = await prisma.review.findMany({
				where: {
					user_id: userId,
				},
			});
			if (reviews.length < 1) {
				throw new Error("리뷰 조회에 실패했습니다.");
			}
			return reviews;
		} catch (error) {
			throw new Error("리뷰 조회에 실패했습니다.");
		}
	}
}
