const rolesData = require('../data/rolesData');
const { v4: uuidv4 } = require('uuid');

exports.createUserRole = async (roleId, userId) => {
    const userRole = await rolesData.createUserRoles({id: uuidv4(), role_id: roleId, user_id: userId});
    return userRole
}