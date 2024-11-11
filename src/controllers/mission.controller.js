import { MissionRepository } from "../repositories/mission.repository.js";
import { MissionService } from "../services/mission.service.js";
import { createMissionDTO, missionResponseDTO } from "../dtos/mission.dto.js";

const missionRepository = new MissionRepository();
const missionService = new MissionService(missionRepository);

export const handleCreateMission = async (req, res) => {
	try {
		const missionData = createMissionDTO(req.body);

		const mission = await missionService.createMission(missionData);

		res.status(201).json({
			success: true,
			data: missionResponseDTO(mission),
		});
	} catch (error) {
		console.error("Error creating mission:", error);

		res.status(error.message.includes("not found") ? 404 : 400).json({
			success: false,
			message: error.message,
		});
	}
};

export const handleGetMissionsByStoreId = async (req, res) => {
	try {
		const missions = await missionService.getMissionsByStoreId(
			req.query.storeId
		);

		res.status(200).json({
			success: true,
			data: missions.map((mission) => missionResponseDTO(mission)),
		});
	} catch (error) {
		console.error("Error getting missions:", error);

		res.status(error.message.includes("not found") ? 404 : 400).json({
			success: false,
			message: error.message,
		});
	}
};

export const handleGetMissionByUserId = async (req, res) => {
	try {
		const missions = await missionService.getMissionsByUserId(req.query.userId);

		res.status(200).json({
			success: true,
			data: missions.map((mission) => missionResponseDTO(mission)),
		});
	} catch (error) {
		console.error("Error getting missions:", error);

		res.status(error.message.includes("not found") ? 404 : 400).json({
			success: false,
			message: error.message,
		});
	}
};
