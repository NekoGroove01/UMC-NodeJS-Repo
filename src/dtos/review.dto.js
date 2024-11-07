export const createReviewDTO = (body) => {
	return {
		userId: body.userId,
		storeId: body.storeId,
		missionId: body.missionId || null,
		rating: body.rating,
		reviewText: body.reviewText,
	};
};

export const reviewResponseDTO = (review) => {
	return {
		reviewId: review.review_id,
		userId: review.user_id,
		storeId: review.store_id,
		missionId: review.mission_id,
		rating: review.rating,
		reviewText: review.review_text,
		createdAt: review.created_at,
		isVerified: review.is_verified,
	};
};
