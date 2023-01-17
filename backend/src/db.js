//Importar Librerias
const {Pool} = require('pg');
const {database} = require ('./config')

//Conexion a la base de datos
const pool = new Pool({
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.database,
    port: database.port
});

module.exports = pool;