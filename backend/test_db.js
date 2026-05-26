const { pool } = require('./config/db');

async function check() {
  try {
    const [orders] = await pool.query('SELECT * FROM orders');
    console.log(`Total orders in DB: ${orders.length}`);
    console.log(orders);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
