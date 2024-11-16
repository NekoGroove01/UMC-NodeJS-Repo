import { ReviewRepository } from "../repositories/review.repository.js";
import { ReviewService } from "../services/review.service.js";
import { createReviewDTO, reviewResponseDTO } from "../dtos/review.dto.js";

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);

export const handleCreateReview = async (req, res, next) => {
	try {
		const reviewData = createReviewDTO(req.body);

		const review = await reviewService.createReview(reviewData);

		res.status(201).success(reviewResponseDTO(review));
	} catch (error) {
		console.error("Error creating review:", error);

		next(error);
	}
};

export const handleGetReviewsByUserId = async (req, res, next) => {
	try {
		const userId = req.query.userId;

		const reviews = await reviewService.getReviewsByUserId(userId);

		res.status(200).success(reviews.map((review) => reviewResponseDTO(review)));
	} catch (error) {
		console.error("Error getting reviews:", error);

		next(error);
	}
};
