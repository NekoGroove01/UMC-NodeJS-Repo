export class ReviewService {
	constructor(reviewRepository) {
		this.reviewRepository = reviewRepository;
	}

	async createReview(reviewData) {
		// Check if store exists
		const storeExists = await this.reviewRepository.checkStoreExists(
			reviewData.storeId
		);
		if (!storeExists) {
			throw new Error("Store not found or inactive");
		}

		// Check for existing review
		const hasExistingReview = await this.reviewRepository.checkExistingReview(
			reviewData.userId,
			reviewData.storeId
		);
		if (hasExistingReview) {
			throw new Error("User has already reviewed this store");
		}

		// Validate rating
		if (reviewData.rating < 1 || reviewData.rating > 5) {
			throw new Error("Rating must be between 1 and 5");
		}

		// Create review
		const review = await this.reviewRepository.createReview(reviewData);
		return review;
	}

	async getReviewsByUserId(userId) {
		const reviews = await this.reviewRepository.getReviewsByuserId(userId);
		if (reviews.length === 0) {
			throw new Error("Reviews not found");
		}
		return reviews;
	}
}
