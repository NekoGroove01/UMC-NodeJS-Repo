import { pool } from "../db.config.js";

export class ReviewRepository {
	async checkStoreExists(storeId) {
		const [rows] = await pool.query(
			"SELECT store_id FROM stores WHERE store_id = ? AND is_active = TRUE",
			[storeId]
		);
		return rows.length > 0;
	}

	async checkExistingReview(userId, storeId) {
		const [rows] = await pool.query(
			"SELECT review_id FROM reviews WHERE user_id = ? AND store_id = ?",
			[userId, storeId]
		);
		return rows.length > 0;
	}

	async createReview(reviewData) {
		const [result] = await pool.query(
			`INSERT INTO reviews 
       (user_id, store_id, mission_id, rating, review_text)
       VALUES (?, ?, ?, ?, ?)`,
			[
				reviewData.userId,
				reviewData.storeId,
				reviewData.missionId,
				reviewData.rating,
				reviewData.reviewText,
			]
		);

		const [newReview] = await pool.query(
			"SELECT * FROM reviews WHERE review_id = ?",
			[result.insertId]
		);

		return newReview[0];
	}
}
