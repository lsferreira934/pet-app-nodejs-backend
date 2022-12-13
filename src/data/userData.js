const database = require("../infra/database/PostgressSQLAdapter");

exports.createUser = async (user) => {
	return await database.query(
		`INSERT INTO pet.users ( id, name, last_name, email, phone, password) 
															 VALUES ($<id>, $<name>, $<last_name>, $<email>, $<phone>, $<password>) RETURNING id`,
		{ ...user }
	);
};

exports.findUserByEmail = async (email) => {
	return await database.query(
		`SELECT r."name" as "role", u.id, u."name", u.last_name, u.email, u.phone, u.password  
			 FROM pet.users u 
		  INNER JOIN pet.user_roles ur ON ur.user_id = u.id
		  INNER JOIN pet.roles r ON r.id = ur.role_id 
		  WHERE u.email = $<email>`,
		{ email: email }
	);
};
