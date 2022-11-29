const database = require('../infra/database/PostgressSQLAdapter')

exports.createUserRoles = async (userRole) => {
   return await database.query(
      `INSERT INTO pet.user_roles (id, role_id, user_id) VALUES ($<id>, $<role_id>, $<user_id>) RETURNING id`, 
      { ...userRole }
   );
}

