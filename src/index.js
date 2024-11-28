import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
	handleUserSignUp,
	handleUserUpdate,
} from "./controllers/user.controller.js";
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
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";
import { googleStrategy, githubStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";

dotenv.config();

// Passport 설정
passport.use(googleStrategy);
passport.use(githubStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

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

app.use(
	"/docs",
	swaggerUiExpress.serve,
	swaggerUiExpress.setup(
		{},
		{
			swaggerOptions: {
				url: "/openapi.json",
			},
		}
	)
);

// 세션 관리 미들웨어
app.use(
	session({
		cookie: {
			secure: false,
			maxAge: 7 * 24 * 60 * 60 * 1000, // ms
		},
		resave: false,
		saveUninitialized: false,
		secret: process.env.EXPRESS_SESSION_SECRET,
		store: new PrismaSessionStore(prisma, {
			checkPeriod: 2 * 60 * 1000, // ms
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
	// #swagger.ignore = true
	console.log(req.user);
	res.send("Hello World!");
});

// OAuth2.0
app.get("/oauth2/login/google", passport.authenticate("google"));
app.get(
	"/oauth2/callback/google",
	passport.authenticate("google", {
		failureRedirect: "/oauth2/login/google",
		successRedirect: "/",
		failureMessage: true,
	}),
	(req, res) => res.redirect("/")
);
app.get("/oauth2/login/github", passport.authenticate("github"));
app.get(
	"/oauth2/callback/github",
	passport.authenticate("github", {
		failureRedirect: "/oauth2/login/github",
		successRedirect: "/",
		failureMessage: true,
	}),
	(req, res) => res.redirect("/")
);

app.get("/openapi.json", async (req, res, next) => {
	// #swagger.ignore = true
	const options = {
		openapi: "3.0.0",
		language: "ko-KR",
		disableLogs: false,
		autoHeaders: true,
		autoQuery: true,
		autoBody: true,
	};

	const doc = {
		info: {
			title: "UMC 7th",
			description: "UMC 7th Node.js 테스트 프로젝트입니다.",
			version: "1.0.0",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Development server",
			},
		],
	};

	try {
		const outputFile = "./swagger-output.json"; // 임시 파일 경로
		const routes = ["./src/index.js"];

		const result = await swaggerAutogen(options)(outputFile, routes, doc);
		res.json(result.data);
	} catch (error) {
		console.error("Swagger generation error:", error);
		res.status(500).json({ error: "Failed to generate API documentation" });
	}
});

app.get("/reviews/user/:userId", handleGetReviewsByUserId);
app.get("/missions/store/:storeId", handleGetMissionsByStoreId);
app.get("/missions/user/:userId", handleGetMissionByUserId);

app.post("/users/signup", handleUserSignUp);
app.post("/reviews", handleCreateReview);
app.post("/missions", handleCreateMission);
app.post("/user-missions", handleCreateUserMission);

app.put("/users/:userId", handleUserUpdate);

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

app.use(passport.session());

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
