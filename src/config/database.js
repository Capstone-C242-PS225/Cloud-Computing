const mysql = require('mysql2/promise');

const dbConfig = {
  host: '35.198.242.76',
  user: 'root',
  password: 'FR33-D4T4',
  database: 'FREE',
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;