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

		// Create mission
		const mission = await this.missionRepository.createMission(missionData);

		return mission;
	}

	async getMissionsByStoreId(storeId) {
		const missions = await this.missionRepository.getMissionsByStoreId(storeId);

		if (missions.length < 1) {
			throw new Error("Missions not found");
		}
		return missions;
	}

	async getMissionsByUserId(userId) {
		const missions = await this.missionRepository.getMissionsByUserId(userId);
		if (missions.length < 1) {
			throw new Error("Missions not found");
		}

		return missions;
	}
}
