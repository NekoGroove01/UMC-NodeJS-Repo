import { prisma } from "../db.config.js";

export class UserMissionRepository {
	async checkMissionExists(missionId) {
		try {
			const mission = await prisma.mission.findFirst({
				where: {
					missionId: missionId,
					isActive: true,
					OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
				},
				include: {
					store: {
						select: {
							storeName: true,
						},
					},
				},
			});

			if (!mission) {
				throw new Error("미션을 찾을 수 없습니다.");
			}
			return mission;
		} catch (error) {
			throw new Error("미션을 찾을 수 없습니다.");
		}
	}

	async checkExistingChallenge(userId, missionId) {
		// 	const [rows] = await pool.query(
		// 		`SELECT user_mission_id, status
		//    FROM user_missions
		//    WHERE user_id = ? AND mission_id = ?`,
		// 		[userId, missionId]
		// 	);
		// 	return rows[0];
		try {
			const userMission = await prisma.userMission.findFirst({
				where: {
					userId: userId,
					missionId: missionId,
				},
			});
			if (!userMission) {
				throw new Error("도전을 찾을 수 없습니다.");
			}
			return userMission;
		} catch (error) {
			throw new Error("도전을 찾을 수 없습니다.");
		}
	}

	async getUserActiveMissionCount(userId) {
		// 	const [rows] = await pool.query(
		// 		`SELECT COUNT(*) as count
		//    FROM user_missions
		//    WHERE user_id = ? AND status = 'ongoing'`,
		// 		[userId]
		// 	);
		// 	return rows[0].count;
		try {
			const count = await prisma.userMission.count({
				where: {
					userId: userId,
					status: "ongoing",
				},
			});
			if (!count) {
				throw new Error("진행 중인 미션을 찾을 수 없습니다.");
			}
			return count;
		} catch (error) {
			throw new Error("진행 중인 미션을 찾을 수 없습니다.");
		}
	}

	async createUserMission(userMissionData) {
		// 	const [result] = await pool.query(
		// 		`INSERT INTO user_missions
		//    (user_id, mission_id, status, started_at)
		//    VALUES (?, ?, 'ongoing', NOW())`,
		// 		[userMissionData.userId, userMissionData.missionId]
		// 	);

		// 	const [newUserMission] = await pool.query(
		// 		"SELECT * FROM user_missions WHERE user_mission_id = ?",
		// 		[result.insertId]
		// 	);

		// 	return newUserMission[0];

		try {
			const userMission = await prisma.userMission.create({
				data: userMissionData,
			});
			if (!userMission) {
				throw new Error("도전 생성에 실패했습니다.");
			}
			return userMission;
		} catch (error) {
			throw new Error("도전 생성에 실패했습니다.");
		}
	}

	async createNotification(userId, missionData) {
		// 	await pool.query(
		// 		`INSERT INTO notifications
		//    (user_id, notification_type, content)
		//    VALUES (?, 'new_mission', ?)`,
		// 		[
		// 			userId,
		// 			`"${missionData.store_name}" 매장의 미션 "${missionData.mission_description}"에 도전하기 시작했습니다!`,
		// 		]
		// 	);

		try {
			await prisma.notification.create({
				data: {
					userId: userId,
					type: "new_mission",
					message: `${missionData.store.storeName} 매장의 미션 "${missionData.missionDescription}"에 도전하기 시작했습니다!`,
				},
			});
		} catch (error) {
			throw new Error("알림 생성에 실패했습니다.");
		}
	}
}
