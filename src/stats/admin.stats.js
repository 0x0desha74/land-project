const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../middleware/verifyToken');
const {
  getDashboardStats,
  getOrderStats,
  getLandStats,
  getUserStats
} = require('./stats.controller');

// All routes require admin authentication
router.use(verifyAdminToken);

// Dashboard statistics
router.get('/dashboard', getDashboardStats);
router.get('/orders', getOrderStats);
router.get('/lands', getLandStats);
router.get('/users', getUserStats);

module.exports = router;