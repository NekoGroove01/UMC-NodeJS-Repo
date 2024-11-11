import { prisma } from "../db.config.js";

export class MissionRepository {
	async checkStoreExists(storeId) {
		const store = await prisma.store.findFirst({
			where: {
				id: storeId, // store_id가 아닌 id 사용
				isActive: true,
			},
		});
		return !!store;
	}

	async getActiveMissionCount(storeId) {
		const count = await prisma.mission.count({
			where: {
				storeId: storeId,
				isActive: true,
				OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
			},
		});
		return count;
	}

	async createMission(missionData) {
		const mission = prisma.missions.create({
			data: missionData,
		});
		return mission;
	}

	async createNotification(storeId) {
		const users = await prisma.user.findMany({
			where: {
				reviews: {
					some: {
						storeId: storeId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		// Prepare notification data
		if (users.length > 0) {
			const notifications = users.map((user) => ({
				userId: user.id,
				type: "new_mission",
				message: "새로운 미션이 등록되었습니다! 지금 확인해보세요.",
			}));

			// Bulk insert notifications
			await prisma.notification.createMany({
				data: notifications,
			});
		}
	}

	async getMissionsByStoreId(storeId) {
		const missions = await prisma.mission.findMany({
			where: {
				storeId: storeId,
				isActive: true,
				OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
			},
		});
		return missions;
	}

	async getMissionsByUserId(userId) {
		const missions = await prisma.mission.findMany({
			where: {
				userMissions: {
					some: {
						userId: Number(userId),
					},
				},
			},
		});
		return missions;
	}
}
