const { pool } = require('../config/db');

async function makeAllAdmins() {
  try {
    const [result] = await pool.query("UPDATE users SET role = 'admin'");
    console.log(`Updated ${result.affectedRows} users to admin role.`);
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    process.exit(0);
  }
}

makeAllAdmins();
