const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrders, updateOrderToDelivered } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/', verifyToken, createOrder);
router.get('/myorders', verifyToken, getMyOrders);
router.get('/', verifyAdmin, getOrders);
router.put('/:id/status', verifyAdmin, updateOrderToDelivered);

module.exports = router;
