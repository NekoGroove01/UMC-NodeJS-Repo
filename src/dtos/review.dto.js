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
		reviewId: review.id,
		userId: review.userId,
		storeId: review.storeId,
		missionId: review.missionId,
		rating: review.rating,
		reviewText: review.reviewText,
		createdAt: review.createdAt,
		isVerified: review.isVerified,
	};
};
