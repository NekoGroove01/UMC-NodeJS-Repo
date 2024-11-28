import { responseFromUser } from "../dtos/user.dto.js";
import { BadRequestError, ConflictError } from "../error.js";
import {
	addUser,
	getUser,
	getUserPreferencesByUserId,
	setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
	const joinUserId = await addUser({
		email: data.email,
		name: data.name,
		gender: data.gender,
		username: data.username,
		birth: data.birth,
		address: data.address,
		detailAddress: data.detailAddress,
		phoneNumber: data.phoneNumber,
	});

	if (joinUserId === null) {
		throw new ConflictError("Failed to sign up");
	}

	for (const preference of data.preferences) {
		await setPreference(joinUserId, preference);
	}

	const user = await getUser(joinUserId);
	const preferences = await getUserPreferencesByUserId(joinUserId);

	return responseFromUser({ user, preferences });
};

// 사용자 정보 업데이트
export const userUpdate = async (userId, data) => {
	const user = await getUser(userId);
	if (user === null) {
		throw new BadRequestError("User not found");
	}

	const updated = await updateUser(userId, {
		email: data.email,
		name: data.name,
		gender: data.gender,
		username: data.username,
		birth: data.birth,
		address: data.address,
		detailAddress: data.detailAddress,
		phoneNumber: data.phoneNumber,
	});

	if (updated === null) {
		throw new ConflictError("Failed to update user");
	}

	return responseFromUser({ updated });
};
