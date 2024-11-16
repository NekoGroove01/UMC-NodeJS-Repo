import { UserMissionRepository } from "../repositories/userMission.repository.js";
import { UserMissionService } from "../services/userMission.service.js";
import {
	createUserMissionDTO,
	userMissionResponseDTO,
} from "../dtos/userMission.dto.js";

const userMissionRepository = new UserMissionRepository();
const userMissionService = new UserMissionService(userMissionRepository);

export const handleCreateUserMission = async (req, res, next) => {
	try {
		const userMissionData = createUserMissionDTO(req.body);

		const userMission = await userMissionService.createUserMission(
			userMissionData
		);

		res.status(201).success(userMissionResponseDTO(userMission));
	} catch (error) {
		console.error("Error creating user mission:", error);

		next(error);
	}
};
