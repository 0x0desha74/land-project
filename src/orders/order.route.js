const express = require('express');
const {
  createOrder,
  getOrdersByEmail,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} = require('./order.controller');
const { verifyAdminToken } = require('../middleware/verifyAdminToken');

const router = express.Router();

// Anyone can use
router.post('/', createOrder);
router.get('/email/:email', getOrdersByEmail);

// Only admin can use
router.get('/all', verifyAdminToken, getAllOrders);
router.put('/status/:id', verifyAdminToken, updateOrderStatus);
router.get('/stats', verifyAdminToken, getOrderStats);

module.exports = router;