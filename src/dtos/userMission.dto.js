export const createUserMissionDTO = (body) => {
	return {
		userId: body.userId,
		missionId: body.missionId,
	};
};

export const userMissionResponseDTO = (userMission) => {
	return {
		userMissionId: userMission.user_mission_id,
		userId: userMission.user_id,
		missionId: userMission.mission_id,
		status: userMission.status,
		startedAt: userMission.started_at,
		completedAt: userMission.completed_at,
	};
};
