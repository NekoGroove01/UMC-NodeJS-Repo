import { NotFoundError, ValidationError } from "../error.js";

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
			throw new NotFoundError("Mission is not found.");
		}

		// Check for existing challenge
		const existingChallenge =
			await this.userMissionRepository.checkExistingChallenge(
				userMissionData.userId,
				userMissionData.missionId
			);

		if (existingChallenge) {
			if (existingChallenge.status === "ongoing") {
				throw new ValidationError("Challenge already exists.");
			} else if (existingChallenge.status === "completed") {
				throw new ValidationError("Challenge already completed.");
			} else if (existingChallenge.status === "reviewed") {
				throw new ValidationError("Challenge already reviewed.");
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
