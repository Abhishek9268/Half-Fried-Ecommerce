const { pool } = require('../config/db');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [cartResult] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
    let cartId;
    
    if (cartResult.length === 0) {
      const [newCart] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
      cartId = newCart.insertId;
    } else {
      cartId = cartResult[0].id;
    }

    const [rows] = await pool.query(
      `SELECT ci.*, p.name, p.price, p.image_url 
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    let [cartResult] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    let cartId = cartResult.length > 0 ? cartResult[0].id : null;

    if (!cartId) {
      const [newCart] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
      cartId = newCart.insertId;
    }

    // Check if item exists in cart
    const [itemExist] = await pool.query('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, product_id]);
    
    if (itemExist.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
        [quantity || 1, cartId, product_id]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, product_id, quantity || 1]
      );
    }

    res.status(200).json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const [cartResult] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (cartResult.length === 0) return res.status(404).json({ message: 'Cart not found' });
    const cartId = cartResult[0].id;

    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
    } else {
      await pool.query('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?', [quantity, cartId, productId]);
    }

    res.status(200).json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const [cartResult] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (cartResult.length === 0) return res.status(404).json({ message: 'Cart not found' });
    const cartId = cartResult[0].id;

    await pool.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
