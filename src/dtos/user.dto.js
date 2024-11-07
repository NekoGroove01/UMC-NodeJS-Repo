export const bodyToUser = (body) => {
	const birth = new Date(body.birth);

	return {
		email: body.email,
		name: body.name,
		gender: body.gender,
		username: body.username,
		birth,
		address: body.address || "",
		detailAddress: body.detailAddress || "",
		phoneNumber: body.phoneNumber,
		preferences: body.preferences,
	};
};

export const responseFromUser = ({ user, preferences }) => {
	// user가 배열로 오며, 첫 번째 요소를 사용
	const userData = user[0];

	return {
		id: userData.id,
		email: userData.email,
		name: userData.name,
		gender: userData.gender,
		username: userData.username,
		birth: userData.birth,
		address: userData.address,
		detailAddress: userData.detail_address,
		phoneNumber: userData.phone_number,
		createdAt: userData.created_at,
		preferences: preferences.map((pref) => ({
			id: pref.id,
			categoryId: pref.food_category_id,
			categoryName: pref.name,
		})),
	};
};
