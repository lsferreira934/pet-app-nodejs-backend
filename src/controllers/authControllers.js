const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../infra/database/PostgressSQLAdapter");

const rolesService = require("../service/rolesService");
const userService = require("../service/userService");
const tokenService = require("../service/tokenService");

const signup = async (req, res) => {
	const { name, last_name, email, phone, password } = req.body;
	const hasRole = req.$role;

	if (!name && !last_name && !email && !phone && !password) return res.status(404).json({ error: "Data not found" });

	try {
		const encryptingPassword = await bcrypt.hash(password, 8);

		const newUserId = await userService.createUser({ name, last_name, email, phone, password: encryptingPassword });

		await rolesService.createUserRole(hasRole[0].id, newUserId[0].id);

		return res.status(200).json({ message: "User was registered successfully." });
	} catch (error) {
		console.log({ error: error.message });
		return res.status(400).json({ error: "User cannot be registered" });
	}
};

const signin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const findUser = await userService.findUserByEmail(email);

		if (!findUser) return res.status(403).json({ error: "User not found" });

		const passwordIsValid = await bcrypt.compare(password, findUser.password);
		if (!passwordIsValid) return res.status(403).json({ error: "User not found" });

		const token = jwt.sign({ id: findUser.id }, process.env.SECRET_JWT, {
			expiresIn: 3600, // 1H
		});

		res.status(200).json({
			id: findUser.id,
			name: findUser.name,
			lastName: findUser.last_name,
			email: findUser.email,
			phone: findUser.phone,
			role: findUser.role,
			token: token,
		});
	} catch (error) {
		console.log({ error: error.message });
		return res.status(400).json({ error: "User cannot be logged in" });
	}
};

const logoff = async (req, res) => {
	try {
		const userId = req.$userId;
		const token = req.headers["x-access-token"];

		await tokenService.insertTokenBlacklist({ userId, token });

		res.status(200).end();
	} catch (error) {
		console.log({ error: error.message });
		return res.status(400).json({ error: "User cannot be logoff" });
	}
};

module.exports = { signup, signin, logoff };
