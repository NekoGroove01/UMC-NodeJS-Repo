import { MissionRepository } from "../repositories/mission.repository.js";
import { MissionService } from "../services/mission.service.js";
import { createMissionDTO, missionResponseDTO } from "../dtos/mission.dto.js";

const missionRepository = new MissionRepository();
const missionService = new MissionService(missionRepository);

export const handleCreateMission = async (req, res, next) => {
	try {
		const missionData = createMissionDTO(req.body);

		const mission = await missionService.createMission(missionData);

		res.status(201).success(missionResponseDTO(mission));
	} catch (error) {
		console.error("Error creating mission:", error);

		next(error);
	}
};

export const handleGetMissionsByStoreId = async (req, res, next) => {
	try {
		const missions = await missionService.getMissionsByStoreId(
			req.query.storeId
		);

		res
			.status(200)
			.success(missions.map((mission) => missionResponseDTO(mission)));
	} catch (error) {
		console.error("Error getting missions:", error);

		next(error);
	}
};

export const handleGetMissionByUserId = async (req, res, next) => {
	try {
		const missions = await missionService.getMissionsByUserId(req.query.userId);

		res
			.status(200)
			.success(missions.map((mission) => missionResponseDTO(mission)));
	} catch (error) {
		console.error("Error getting missions:", error);

		next(error);
	}
};
