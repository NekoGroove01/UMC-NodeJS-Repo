export const createMissionDTO = (body) => {
	return {
		storeId: body.storeId,
		description: body.description,
		points: body.points,
		startDate: body.startDate ? new Date(body.startDate) : new Date(),
		endDate: body.endDate ? new Date(body.endDate) : null,
	};
};

export const missionResponseDTO = (mission) => {
	return {
		missionId: mission.missionId,
		storeId: mission.storeId,
		description: mission.missionDescription,
		points: mission.points,
		startDate: mission.startDate,
		endDate: mission.endDate,
		isActive: mission.isActive,
		createdAt: mission.createdAt,
	};
};
