import { MissionRepository } from "../repositories/mission.repository.js";
import { MissionService } from "../services/mission.service.js";
import { createMissionDTO, missionResponseDTO } from "../dtos/mission.dto.js";

const missionRepository = new MissionRepository();
const missionService = new MissionService(missionRepository);

export const handleCreateMission = async (req, res, next) => {
	/*
    #swagger.summary = '미션 생성 API'
	#swagger.tags = ['Missions']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              storeId: { type: "number" },
              description: { type: "string" },
              points: { type: "number" },
              startDate: { type: "string", format: "date-time" },
              endDate: { type: "string", format: "date-time", nullable: true }
            },
            required: ["storeId", "description", "points"]
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "미션 생성 성공",
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
                  missionId: { type: "number" },
                  storeId: { type: "number" },
                  description: { type: "string" },
                  points: { type: "number" },
                  startDate: { type: "string", format: "date-time" },
                  endDate: { type: "string", format: "date-time", nullable: true },
                  isActive: { type: "boolean" },
                  createdAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "미션 생성 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string" },
                  statusCode: { type: "number", example: 400 },
                  reason: { type: "string" },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true }
            }
          }
        }
      }
    }
  */
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
	/*
    #swagger.summary = '사용자별 미션 목록 조회 API'
    #swagger.tags = ['Missions']
    #swagger.parameters['userId'] = {
      in: 'path',
      description: '사용자 ID',
      required: true,
      type: 'number'
    }
    #swagger.responses[200] = {
      description: "사용자 미션 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true },
              success: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    missionId: { type: "number" },
                    storeId: { type: "number" },
                    description: { type: "string" },
                    points: { type: "number" },
                    startDate: { type: "string", format: "date-time" },
                    endDate: { type: "string", format: "date-time", nullable: true },
                    isActive: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "사용자를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "USER_NOT_FOUND" },
                  statusCode: { type: "number", example: 404 },
                  reason: { type: "string", example: "해당 사용자를 찾을 수 없습니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true }
            }
          }
        }
      }
    }
  */
	try {
		const missions = await missionService.getMissionsByStoreId(
			req.params.storeId
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
	/*
    #swagger.summary = '가게별 미션 목록 조회 API'
    #swagger.tags = ['Missions']
    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      type: 'number'
    }
    #swagger.parameters['isActive'] = {
      in: 'query',
      description: '활성 미션만 조회 (optional)',
      required: false,
      type: 'boolean'
    }
    #swagger.responses[200] = {
      description: "가게 미션 목록 조회 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true },
              success: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    missionId: { type: "number" },
                    storeId: { type: "number" },
                    description: { type: "string" },
                    points: { type: "number" },
                    startDate: { type: "string", format: "date-time" },
                    endDate: { type: "string", format: "date-time", nullable: true },
                    isActive: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: "가게를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "STORE_NOT_FOUND" },
                  statusCode: { type: "number", example: 404 },
                  reason: { type: "string", example: "해당 가게를 찾을 수 없습니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true }
            }
          }
        }
      }
    }
  */
	try {
		const missions = await missionService.getMissionsByUserId(
			req.params.userId
		);

		res
			.status(200)
			.success(missions.map((mission) => missionResponseDTO(mission)));
	} catch (error) {
		console.error("Error getting missions:", error);

		next(error);
	}
};
