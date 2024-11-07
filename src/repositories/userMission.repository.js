import { pool } from "../db.config.js";

export class UserMissionRepository {
	async checkMissionExists(missionId) {
		const [rows] = await pool.query(
			`SELECT m.*, s.store_name 
       FROM missions m
       JOIN stores s ON m.store_id = s.store_id
       WHERE m.mission_id = ? 
       AND m.is_active = TRUE 
       AND (m.end_date IS NULL OR m.end_date > NOW())`,
			[missionId]
		);
		return rows[0];
	}

	async checkExistingChallenge(userId, missionId) {
		const [rows] = await pool.query(
			`SELECT user_mission_id, status 
       FROM user_missions 
       WHERE user_id = ? AND mission_id = ?`,
			[userId, missionId]
		);
		return rows[0];
	}

	async getUserActiveMissionCount(userId) {
		const [rows] = await pool.query(
			`SELECT COUNT(*) as count 
       FROM user_missions 
       WHERE user_id = ? AND status = 'ongoing'`,
			[userId]
		);
		return rows[0].count;
	}

	async createUserMission(userMissionData) {
		const [result] = await pool.query(
			`INSERT INTO user_missions 
       (user_id, mission_id, status, started_at)
       VALUES (?, ?, 'ongoing', NOW())`,
			[userMissionData.userId, userMissionData.missionId]
		);

		const [newUserMission] = await pool.query(
			"SELECT * FROM user_missions WHERE user_mission_id = ?",
			[result.insertId]
		);

		return newUserMission[0];
	}

	async createNotification(userId, missionData) {
		await pool.query(
			`INSERT INTO notifications 
       (user_id, notification_type, content)
       VALUES (?, 'new_mission', ?)`,
			[
				userId,
				`"${missionData.store_name}" 매장의 미션 "${missionData.mission_description}"에 도전하기 시작했습니다!`,
			]
		);
	}
}
