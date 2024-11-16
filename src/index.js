import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";
import {
	handleCreateReview,
	handleGetReviewsByUserId,
} from "./controllers/review.controller.js";
import {
	handleCreateMission,
	handleGetMissionByUserId,
	handleGetMissionsByStoreId,
} from "./controllers/mission.controller.js";
import { handleCreateUserMission } from "./controllers/userMission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
	res.success = (success) => {
		return res.json({ resultType: "SUCCESS", error: null, success });
	};

	res.error = ({
		errorCode = "unknown",
		statusCode = 500,
		reason = null,
		data = null,
	}) => {
		return res.json({
			resultType: "FAIL",
			error: { errorCode, statusCode, reason, data },
			success: null,
		});
	};

	next();
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/reviews", handleCreateReview);
app.post("/api/v1/missions", handleCreateMission);
app.post("/api/v1/user-missions", handleCreateUserMission);

app.get("/api/v1/reviews/user", handleGetReviewsByUserId);
app.get("/api/v1/missions/store", handleGetMissionsByStoreId);
app.get("/api/v1/missions/user", handleGetMissionByUserId);

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((req, res) => {
	res.status(404).error({
		errorCode: "NOT_FOUND",
		reason: "요청하신 리소스를 찾을 수 없습니다",
	});
});

// 5xx 에러 처리 미들웨어
app.use((err, req, res, next) => {
	console.error(err);

	if (res.headersSent) {
		return next(err);
	}

	const statusCode = err.statusCode || 500;
	res.status(statusCode).error({
		errorCode: err.errorCode || "INTERNAL_SERVER_ERROR",
		statusCode: err.statusCode || 500,
		reason: err.message || "서버 내부 오류가 발생했습니다",
		data: process.env.NODE_ENV === "development" ? err.stack : null,
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
