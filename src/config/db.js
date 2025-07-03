const config = require('./config.js');
const { Pool } = require('pg');

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  password: config.DB_PASSWORD,
  database: config.DB_DATABASE,
  port: config.DB_PORT
});

module.exports = pool;