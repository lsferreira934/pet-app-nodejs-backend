const database = require('../infra/database/PostgressSQLAdapter');

const mwCheckRoleExisted = async (req, res, next) => {
    try {
        const { role } = req.body;

        const hasRole = await database.query(`SELECT * FROM pet.roles`);
        
        const checkRole = hasRole.filter(r => r.name === role.toLowerCase());

        if (!checkRole.length) return res.status(401).json({ error: 'Role not found' });

        req.$role = checkRole;
        next();
    } catch (error) {
        console.log({ error: error.message });
        return res.status(400).json({ error: "User cannot be registered" });
    };
};

module.exports = mwCheckRoleExisted;