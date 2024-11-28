import { UserMissionRepository } from "../repositories/userMission.repository.js";
import { UserMissionService } from "../services/userMission.service.js";
import {
	createUserMissionDTO,
	userMissionResponseDTO,
} from "../dtos/userMission.dto.js";

const userMissionRepository = new UserMissionRepository();
const userMissionService = new UserMissionService(userMissionRepository);

export const handleCreateUserMission = async (req, res, next) => {
	/*
    #swagger.summary = '사용자 미션 참여 API'
	#swagger.tags = ['Missions']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "number" },
              missionId: { type: "number" }
            },
            required: ["userId", "missionId"]
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "미션 참여 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true },
              success: {
                type: "object",
                properties: {
                  userMissionId: { type: "number" },
                  userId: { type: "number" },
                  missionId: { type: "number" },
                  status: { type: "string", enum: ["STARTED", "COMPLETED", "FAILED"] },
                  startedAt: { type: "string", format: "date-time" },
                  completedAt: { type: "string", format: "date-time", nullable: true }
                }
              }
            }
          }
        }
      }
    }
  */
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
