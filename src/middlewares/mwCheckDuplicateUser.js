const database = require('../infra/database/PostgressSQLAdapter');

const checkDuplicateUser = async (req, res, next) => {
    try {
        const { email } = req.body;

        const getUser = await database.query(`SELECT * FROM pet.users u WHERE u.email = $<email>`, { email });
        if(!!getUser.length) return res.status(406).json({error: 'Email is already in use'});

        next();
    } catch (error) {
        console.log({ error: error.message });
        return res.status(400).json({ error: "User cannot be registered" });
    };
};

module.exports = checkDuplicateUser;