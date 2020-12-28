// untuk koneksi database
var mysql = require('mysql');
var dotenv = require('dotenv');

dotenv.config({
    path: './.env'
});

var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

module.exports = connection;