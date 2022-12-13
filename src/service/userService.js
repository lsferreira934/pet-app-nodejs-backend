const { v4: uuidv4 } = require("uuid");
const userData = require("../data/userData");

exports.createUser = async (user) => {
	return await userData.createUser({ id: uuidv4(), ...user });
};

exports.findUserByEmail = async (email) => {
	const [findUser] = await userData.findUserByEmail(email);
	return findUser;
};
