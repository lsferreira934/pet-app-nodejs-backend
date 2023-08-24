require('dotenv').config();
const pgp = require('pg-promise')();

const conection = {
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    database: process.env.DATABASE_DB,
};

const db = pgp(conection);

db.one('SELECT version()').then(data => {
    console.log('Conexão bem-sucedida!');
    console.log('Versão do banco de dados:', data.version);
}).catch(error => {
    console.error('Erro ao conectar ao banco de dados:', error);
});

module.exports = db;