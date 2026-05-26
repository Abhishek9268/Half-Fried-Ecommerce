const Razorpay = require('razorpay');
const crypto = require('crypto');
const { pool } = require('../config/db');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay/order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, order_id } = req.body;

    let order;

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.trim() === 'test_key_id') {
      order = {
        id: 'order_mock_' + crypto.randomBytes(8).toString('hex'),
        amount: amount * 100,
        currency: "INR"
      };
    } else {
      const options = {
        amount: amount * 100, // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_order_${order_id}`
      };
      order = await razorpay.orders.create(options);
    }
    
    // Update our order record with razorpay_order_id
    await pool.query('UPDATE orders SET razorpay_order_id = ? WHERE id = ?', [order.id, order_id]);
    
    res.status(200).json(order);
  } catch (err) {
    console.error('Error in createRazorpayOrder:', err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    let isAuthentic = false;

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.trim() === 'test_key_id') {
      isAuthentic = razorpay_signature === 'mock_signature';
    } else {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
      await pool.query(
        'INSERT INTO payments (order_id, razorpay_payment_id, razorpay_signature, status) VALUES (?, ?, ?, ?)',
        [order_id, razorpay_payment_id, razorpay_signature, 'Success']
      );

      // Update order status
      await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['Paid', order_id]);

      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
