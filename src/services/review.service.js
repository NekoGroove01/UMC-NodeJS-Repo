import { BadRequestError, ConflictError, NotFoundError } from "../error.js";

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
			throw new NotFoundError("Store not found");
		}

		// Check for existing review
		const hasExistingReview = await this.reviewRepository.checkExistingReview(
			reviewData.userId,
			reviewData.storeId
		);
		if (hasExistingReview) {
			throw new ConflictError("Review already exists");
		}

		// Validate rating
		if (reviewData.rating < 1 || reviewData.rating > 5) {
			throw new BadRequestError("Rating must be between 1 and 5");
		}

		// Create review
		const review = await this.reviewRepository.createReview(reviewData);
		return review;
	}

	async getReviewsByUserId(userId) {
		const reviews = await this.reviewRepository.getReviewsByuserId(userId);
		if (reviews.length === 0) {
			throw new NotFoundError("Reviews not found");
		}
		return reviews;
	}
}
