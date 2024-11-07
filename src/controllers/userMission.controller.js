import { UserMissionRepository } from "../repositories/userMission.repository.js";
import { UserMissionService } from "../services/userMission.service.js";
import {
	createUserMissionDTO,
	userMissionResponseDTO,
} from "../dtos/userMission.dto.js";

const userMissionRepository = new UserMissionRepository();
const userMissionService = new UserMissionService(userMissionRepository);

export const handleCreateUserMission = async (req, res) => {
	try {
		const userMissionData = createUserMissionDTO(req.body);

		const userMission = await userMissionService.createUserMission(
			userMissionData
		);

		res.status(201).json({
			success: true,
			data: userMissionResponseDTO(userMission),
		});
	} catch (error) {
		console.error("Error creating user mission:", error);

		res.status(error.message.includes("not found") ? 404 : 400).json({
			success: false,
			message: error.message,
		});
	}
};
