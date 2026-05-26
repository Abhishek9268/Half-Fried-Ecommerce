const { pool } = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, baseTotal } = req.body; 
    // items: [{ product_id, quantity, price }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const [insertResult] = await pool.query(
      'INSERT INTO orders (user_id, base_total, status) VALUES (?, ?, ?)',
      [userId, baseTotal, 'Pending']
    );
    
    // Fetch the inserted order
    const [insertedOrder] = await pool.query('SELECT * FROM orders WHERE id = ?', [insertResult.insertId]);
    const order = insertedOrder[0];

    // Insert order items
    for (let item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    // Clear user cart
    const [cartResult] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (cartResult.length > 0) {
      await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartResult[0].id]);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Error in createOrder:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, u.name as user_name 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const [updateResult] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status || 'Delivered', id]
    );

    if (updateResult.affectedRows === 0) return res.status(404).json({ message: 'Order not found' });
    
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrders, updateOrderToDelivered };
