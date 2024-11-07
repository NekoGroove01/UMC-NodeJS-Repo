export class MissionService {
	constructor(missionRepository) {
		this.missionRepository = missionRepository;
	}

	async createMission(missionData) {
		// Check if store exists
		const storeExists = await this.missionRepository.checkStoreExists(
			missionData.storeId
		);
		if (!storeExists) {
			throw new Error("Store not found or inactive");
		}

		// Validate points
		if (missionData.points < 0) {
			throw new Error("Points must be a positive number");
		}

		// Validate dates
		if (missionData.endDate && missionData.endDate < missionData.startDate) {
			throw new Error("End date must be after start date");
		}

		// Check active mission count (Optional: limit the number of active missions per store)
		const activeMissionCount =
			await this.missionRepository.getActiveMissionCount(missionData.storeId);
		if (activeMissionCount >= 5) {
			// 예시: 가게당 최대 5개의 활성 미션으로 제한
			throw new Error(
				"Store has reached the maximum number of active missions"
			);
		}

		// Create mission
		const mission = await this.missionRepository.createMission(missionData);

		return mission;
	}
}
