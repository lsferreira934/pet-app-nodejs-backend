const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../infra/database/PostgressSQLAdapter');

const signup = async (req, res) => {
    const { name, last_name, email, phone, password } = req.body
    const hasRole = req.$role;

    if (!name && !last_name && !email && !phone && !password) return res.status(404).json({ error: 'Data not found' });

    const newUserId = uuidv4();

    try {
        const encryptingPassword = await bcrypt.hash(password, 8);

        await database.query(
            `INSERT INTO pet.users ( id, name, last_name, email, phone, password) VALUES ($<id>, $<name>, $<last_name>, $<email>, $<phone>, $<password>)`,
            { id: newUserId, name, last_name, email, phone, password: encryptingPassword }
        );

        await database.query(
            `INSERT INTO pet.user_roles (id, role_id, user_id) VALUES ($<id>, $<role_id>, $<user_id>)`,
            { id: uuidv4(), role_id: hasRole[0].id, user_id: newUserId }
        );

        return res.status(200).json({ message: "User was registered successfully." });
    } catch (error) {
        console.log({ error: error.message });
        return res.status(400).json({ error: "User cannot be registered" });
    };
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [findUser] = await database.any(`SELECT r."name" as "role", u.id, u."name", u.last_name, u.email, u.phone, u.password  
                                                   FROM pet.users u 
                                                  INNER JOIN pet.user_roles ur ON ur.user_id = u.id
                                                  INNER JOIN pet.roles r ON r.id = ur.role_id 
                                                  WHERE u.email = $<email>`, { email });

        if (!findUser) return res.status(403).json({ error: 'User not found' });

        const passwordIsValid = await bcrypt.compare(password, findUser.password);
        if (!passwordIsValid) return res.status(403).json({ error: 'User not found' });

        const token = jwt.sign({ id: findUser.id }, process.env.SECRET_JWT, {
            expiresIn: 3600 // 1H
        });

        res.status(200).json({
            id: findUser.id,
            name: findUser.name,
            lastName: findUser.last_name,
            email: findUser.email,
            phone: findUser.phone,
            role: findUser.role,
            token: token
        });
    } catch (error) {
        console.log({ error: error.message });
        return res.status(400).json({ error: "User cannot be logged in" });
    };
};

const logoff = async (req, res) => {
    try {
        const userId = req.$userId;
        const token = req.headers['x-access-token'];

        await database.query('INSERT INTO pet.blacklist_tokens (id, user_id, token) VALUES ($<id>, $<userId>, $<token>)',
            { id: uuidv4(), userId, token }
        )

        res.status(200).end()
    } catch (error) {
        console.log({ error: error.message });
        return res.status(400).json({ error: "User cannot be logoff" });
    };
}

module.exports = { signup, signin, logoff };