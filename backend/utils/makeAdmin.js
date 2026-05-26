const { pool } = require('../config/db');

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email address.');
    console.log('Usage: node makeAdmin.js <email>');
    process.exit(1);
  }

  try {
    const [result] = await pool.query(
      "UPDATE users SET role = 'admin' WHERE email = ?",
      [email]
    );

    if (result.affectedRows === 0) {
      console.log(`No user found with email: ${email}`);
    } else {
      console.log(`Successfully updated ${email} to admin role!`);
    }
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    process.exit(0);
  }
}

makeAdmin();
