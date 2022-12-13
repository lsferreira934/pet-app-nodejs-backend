const tokenData = require("../data/tokenData");
const { v4: uuidv4 } = require("uuid");

exports.insertTokenBlacklist = async (token) => {
	return await tokenData.insertTokenBlacklist({ id: uuidv4(), ...token });
};
