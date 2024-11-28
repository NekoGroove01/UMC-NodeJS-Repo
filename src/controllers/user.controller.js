import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { updateUser } from "../repositories/user.repository.js";

export const handleUserSignUp = async (req, res, next) => {
	/*
    #swagger.summary = '회원 가입 API'
    #swagger.tags = ['Users']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              name: { type: "string" },
              gender: { type: "string", enum: ["MALE", "FEMALE", "OTHER"] },
              username: { type: "string" },
              birth: { type: "string", format: "date" },
              address: { type: "string" },
              detailAddress: { type: "string" },
              phoneNumber: { type: "string", pattern: "^\\d{2,3}-\\d{3,4}-\\d{4}$" },
              preferences: { 
                type: "array", 
                items: { 
                  type: "number",
                  description: "음식 카테고리 ID"
                }
              }
            },
            required: ["email", "name", "gender", "username", "birth", "phoneNumber", "preferences"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "회원 가입 성공",
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
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: {
                    type: "array",
                    items: { type: "string" },
                    description: "선호하는 음식 카테고리 이름 목록"
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "회원 가입 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "INVALID_INPUT" },
                  statusCode: { type: "number", example: 400 },
                  reason: { type: "string", example: "잘못된 입력값입니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true }
            }
          }
        }
      }
    }
    #swagger.responses[409] = {
      description: "이미 존재하는 이메일",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "EMAIL_ALREADY_EXISTS" },
                  statusCode: { type: "number", example: 409 },
                  reason: { type: "string", example: "이미 존재하는 이메일입니다." },
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
	console.log("회원가입을 요청했습니다!");
	console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

	const user = await userSignUp(bodyToUser(req.body));
	res.status(StatusCodes.OK).success(user);
};

// 사용자 정보 업데이트
export const handleUserUpdate = async (req, res, next) => {
	/*
   #swagger.summary = '회원 수정 API'
    #swagger.tags = ['Users']
    #swagger.parameters['userId'] = {
      in: 'path',
      description: 'user ID',
      required: true,
      type: 'number'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", format: "email" },
              name: { type: "string" },
              gender: { type: "string", enum: ["male", "female", "other"] },
              username: { type: "string" },
              birth: { type: "string", format: "date" },
              address: { type: "string" },
              detailAddress: { type: "string" },
              phoneNumber: { type: "string", pattern: "^\\d{2,3}-\\d{3,4}-\\d{4}$" },
            },
            required: ["email", "name", "gender", "username", "birth", "phoneNumber", "preferences"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "기존 회원 정보 수정 성공",
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
                  email: { type: "string" },
                  name: { type: "string" },
                  preferCategory: {
                    type: "array",
                    items: { type: "string" },
                    description: "선호하는 음식 카테고리 이름 목록"
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: "회원 정보 수정 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "INVALID_INPUT" },
                  statusCode: { type: "number", example: 400 },
                  reason: { type: "string", example: "잘못된 user Id입니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true }
            }
          }
        }
      }
    }
    #swagger.responses[409] = {
      description: "정보 수정 중 오류 발생",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "EMAIL_ALREADY_EXISTS" },
                  statusCode: { type: "number", example: 409 },
                  reason: { type: "string", example: "정보 수정 중 오류 발생." },
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
	console.log("사용자 정보 업데이트를 요청했습니다!");
	console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

	const user = await updateUser(req.params.userId, bodyToUser(req.body));
	res.status(StatusCodes.OK).success(user);
};
