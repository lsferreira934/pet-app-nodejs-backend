const database = require("../infra/database/PostgressSQLAdapter");

exports.insertTokenBlacklist = async (token) => {
	return await database.query("INSERT INTO pet.blacklist_tokens (id, user_id, token) VALUES ($<id>, $<userId>, $<token>)", { ...token });
};
