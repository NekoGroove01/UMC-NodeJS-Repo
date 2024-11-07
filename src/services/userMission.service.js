export class UserMissionService {
	constructor(userMissionRepository) {
		this.userMissionRepository = userMissionRepository;
	}

	async createUserMission(userMissionData) {
		// Check if mission exists and is active
		const mission = await this.userMissionRepository.checkMissionExists(
			userMissionData.missionId
		);
		if (!mission) {
			throw new Error("Mission not found or inactive");
		}

		// Check for existing challenge
		const existingChallenge =
			await this.userMissionRepository.checkExistingChallenge(
				userMissionData.userId,
				userMissionData.missionId
			);

		if (existingChallenge) {
			if (existingChallenge.status === "ongoing") {
				throw new Error("이미 도전 중인 미션입니다.");
			} else if (existingChallenge.status === "completed") {
				throw new Error("이미 완료한 미션입니다.");
			} else if (existingChallenge.status === "reviewed") {
				throw new Error("이미 리뷰까지 완료한 미션입니다.");
			}
		}

		// Create user mission
		const userMission = await this.userMissionRepository.createUserMission(
			userMissionData
		);

		// Create notification
		await this.userMissionRepository.createNotification(
			userMissionData.userId,
			mission
		);

		return userMission;
	}
}
