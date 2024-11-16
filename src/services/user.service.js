import { responseFromUser } from "../dtos/user.dto.js";
import { BadRequestError } from "../error.js";
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
		throw new BadRequestError("Failed to sign up");
	}

	for (const preference of data.preferences) {
		await setPreference(joinUserId, preference);
	}

	const user = await getUser(joinUserId);
	const preferences = await getUserPreferencesByUserId(joinUserId);

	return responseFromUser({ user, preferences });
};