const jwt = require('jsonwebtoken');
const database = require('../infra/database/PostgressSQLAdapter');

const checkTokenIsValid = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ error: 'Token invalid' });

    const isTokenInBlacklist = await database.query('SELECT * FROM pet.blacklist_tokens WHERE token = $<token>', { token });
    if (!!isTokenInBlacklist.length) return res.status(401).json({ error: 'Token invalid' });

    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
        if(err) return res.status(401).json({ error: 'Token invalid' });
        req.$userId = decoded.id;
        next();
    });
}

module.exports = checkTokenIsValid;