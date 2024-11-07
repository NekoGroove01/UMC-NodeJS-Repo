import { pool } from "../db.config.js";

export class MissionRepository {
	async checkStoreExists(storeId) {
		const [rows] = await pool.query(
			"SELECT store_id FROM stores WHERE store_id = ? AND is_active = TRUE",
			[storeId]
		);
		return rows.length > 0;
	}

	async getActiveMissionCount(storeId) {
		const [rows] = await pool.query(
			`SELECT COUNT(*) as count 
       FROM missions 
       WHERE store_id = ? AND is_active = TRUE 
       AND (end_date IS NULL OR end_date > NOW())`,
			[storeId]
		);
		return rows[0].count;
	}

	async createMission(missionData) {
		const [result] = await pool.query(
			`INSERT INTO missions 
       (store_id, mission_description, points, start_date, end_date)
       VALUES (?, ?, ?, ?, ?)`,
			[
				missionData.storeId,
				missionData.description,
				missionData.points,
				missionData.startDate,
				missionData.endDate,
			]
		);

		const [newMission] = await pool.query(
			"SELECT * FROM missions WHERE mission_id = ?",
			[result.insertId]
		);

		return newMission[0];
	}

	async createNotification(storeId) {
		// Notify users who have previously interacted with the store
		const [users] = await pool.query(
			`SELECT DISTINCT u.user_id 
       FROM users u 
       LEFT JOIN reviews r ON u.user_id = r.user_id 
       WHERE r.store_id = ?`,
			[storeId]
		);

		// Bulk insert notifications
		if (users.length > 0) {
			const notifications = users.map((user) => [
				user.user_id,
				"new_mission",
				"새로운 미션이 등록되었습니다! 지금 확인해보세요.",
			]);

			await pool.query(
				`INSERT INTO notifications 
         (user_id, notification_type, content)
         VALUES ?`,
				[notifications]
			);
		}
	}
}
