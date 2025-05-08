const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdminToken } = require('../middleware/verifyToken');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders
} = require('./order.controller');

// Public routes
router.post('/', createOrder);

// Protected routes
router.get('/user', verifyToken, getUserOrders);
router.get('/:id', verifyToken, getOrderById);

// Admin routes
router.get('/', verifyAdminToken, getAllOrders);
router.put('/:id/status', verifyAdminToken, updateOrderStatus);
router.delete('/:id', verifyAdminToken, deleteOrder);

module.exports = router;