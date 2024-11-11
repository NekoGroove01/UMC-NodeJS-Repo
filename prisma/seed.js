// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	await prisma.notification.deleteMany({});
	await prisma.review.deleteMany({});
	await prisma.userMission.deleteMany({});
	await prisma.mission.deleteMany({});
	await prisma.store.deleteMany({});
	await prisma.region.deleteMany({});
	await prisma.userPreference.deleteMany({});
	await prisma.foodCategory.deleteMany({});
	await prisma.user.deleteMany({});

	console.log("Database has been reset");
	// Regions 추가
	const gangnam = await prisma.region.create({
		data: {
			regionName: "강남구",
		},
	});

	// Store 추가
	const store1 = await prisma.store.create({
		data: {
			regionId: gangnam.id,
			storeName: "스타벅스 강남점",
			address: "서울시 강남구 강남대로 123",
			isActive: true,
		},
	});

	// Mission 추가
	const mission1 = await prisma.mission.create({
		data: {
			storeId: store1.id,
			description: "아메리카노 3잔 주문하고 인증샷 찍기",
			points: 500,
			startDate: new Date(),
			endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
			isActive: true,
		},
	});

	// User 추가
	const user1 = await prisma.user.create({
		data: {
			username: "john_doe",
			email: "john@example.com",
			name: "John Doe",
			gender: "male",
			birth: new Date("1990-01-01"),
			phoneNumber: "010-1234-5678",
			points: 0,
		},
	});

	const userMission = await prisma.userMission.create({
		data: {
			userId: user1.id,
			missionId: mission1.id,
			status: "ongoing",
			startedAt: new Date(),
		},
	});

	// Review 추가
	await prisma.review.create({
		data: {
			userId: user1.id,
			storeId: store1.id,
			missionId: mission1.id,
			rating: 5,
			reviewText: "매장이 깨끗하고 직원분들이 친절해요!",
			isVerified: true,
		},
	});

	console.log("Seed data inserted successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
