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
		missionId: mission.mission_id,
		storeId: mission.store_id,
		description: mission.mission_description,
		points: mission.points,
		startDate: mission.start_date,
		endDate: mission.end_date,
		isActive: mission.is_active,
		createdAt: mission.created_at,
	};
};
