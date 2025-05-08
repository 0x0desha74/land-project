const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdminToken } = require('../middleware/verifyToken');
const {
  createLand,
  getAllLands,
  getLandById,
  updateLand,
  deleteLand,
  getTrendingLands
} = require('./land.controller');

// Public routes
router.get('/', getAllLands);
router.get('/trending', getTrendingLands);
router.get('/:id', getLandById);

// Protected routes (admin only)
router.post('/', verifyAdminToken, createLand);
router.put('/:id', verifyAdminToken, updateLand);
router.delete('/:id', verifyAdminToken, deleteLand);

module.exports = router;
