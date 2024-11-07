import { ReviewRepository } from "../repositories/review.repository.js";
import { ReviewService } from "../services/review.service.js";
import { createReviewDTO, reviewResponseDTO } from "../dtos/review.dto.js";

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);

export const handleCreateReview = async (req, res) => {
	try {
		const reviewData = createReviewDTO(req.body);

		const review = await reviewService.createReview(reviewData);

		res.status(201).json({
			success: true,
			data: reviewResponseDTO(review),
		});
	} catch (error) {
		console.error("Error creating review:", error);

		res.status(error.message.includes("not found") ? 404 : 400).json({
			success: false,
			message: error.message,
		});
	}
};