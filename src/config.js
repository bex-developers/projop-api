const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: __dirname + `/../.env.${process.env.NODE_ENV}`
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    PORT : process.env.PORT ,
    DB_USER : process.env.DB_USER,
    DB_HOST : process.env.DB_HOST,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_DATABASE : process.env.DB_DATABASE,
    DB_PORT : process.env.DB_PORT,
}