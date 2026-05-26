const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

router.post('/razorpay/order', verifyToken, createRazorpayOrder);
router.post('/razorpay/verify', verifyToken, verifyRazorpayPayment);

module.exports = router;
