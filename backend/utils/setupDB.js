const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const setupDatabase = async () => {
  const sqlPath = path.join(__dirname, '../models', 'init.sql');
  const sql = fs.readFileSync(sqlPath).toString();

  try {
    console.log('Initializing database tables...');
    await pool.query(sql);
    console.log('Database tables ensured.');

    // Ensure password reset columns exist in users table
    try {
      await pool.query('ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL');
      console.log('Database schema check: reset_token column ensured.');
    } catch (err) {
      // Column already exists, ignore
    }

    try {
      await pool.query('ALTER TABLE users ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL');
      console.log('Database schema check: reset_token_expiry column ensured.');
    } catch (err) {
      // Column already exists, ignore
    }
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
};

module.exports = setupDatabase;
