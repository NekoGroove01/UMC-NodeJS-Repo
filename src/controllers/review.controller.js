import { ReviewRepository } from "../repositories/review.repository.js";
import { ReviewService } from "../services/review.service.js";
import { createReviewDTO, reviewResponseDTO } from "../dtos/review.dto.js";

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);

export const handleCreateReview = async (req, res, next) => {
	/*
    #swagger.summary = '리뷰 작성 API'
	#swagger.tags = ['Reviews']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "number" },
              storeId: { type: "number" },
              missionId: { type: "number", nullable: true },
              rating: { type: "number", minimum: 0, maximum: 5 },
              reviewText: { type: "string" }
            },
            required: ["userId", "storeId", "rating", "reviewText"]
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: "리뷰 작성 성공",
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
                  reviewId: { type: "number" },
                  userId: { type: "number" },
                  storeId: { type: "number" },
                  missionId: { type: "number", nullable: true },
                  rating: { type: "number" },
                  reviewText: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                  isVerified: { type: "boolean" }
                }
              }
            }
          }
        }
      }
    }
  */
	try {
		const reviewData = createReviewDTO(req.body);

		const review = await reviewService.createReview(reviewData);

		res.status(201).success(reviewResponseDTO(review));
	} catch (error) {
		console.error("Error creating review:", error);

		next(error);
	}
};

export const handleGetReviewsByUserId = async (req, res, next) => {
	/*
    #swagger.summary = '사용자별 리뷰 목록 조회 API'
    #swagger.tags = ['Reviews']
    #swagger.parameters['userId'] = {
      in: 'path',
      description: '사용자 ID',
      required: true,
      type: 'number'
    }
    #swagger.responses[200] = {
      description: "사용자 리뷰 목록 조회 성공",
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
                    reviewId: { type: "number" },
                    userId: { type: "number" },
                    storeId: { type: "number" },
                    missionId: { type: "number", nullable: true },
                    rating: { type: "number" },
                    reviewText: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    isVerified: { type: "boolean" }
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
		const userId = req.params.userId;

		const reviews = await reviewService.getReviewsByUserId(userId);

		res.status(200).success(reviews.map((review) => reviewResponseDTO(review)));
	} catch (error) {
		console.error("Error getting reviews:", error);

		next(error);
	}
};
