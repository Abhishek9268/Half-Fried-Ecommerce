const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database via pool');
    connection.release();
  })
  .catch(err => {
    console.error('Unexpected error on idle client', err);
  });

module.exports = {
  // Helper wrapper to match Postgres pg pool.query signature
  // We cannot easily mock the return format {rows} without breaking some controllers
  // so we will rewrite controllers to use standard [rows, fields] = await pool.query(...)
  query: (text, params) => pool.query(text, params),
  pool,
};
