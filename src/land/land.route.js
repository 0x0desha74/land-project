const express = require('express');
const { verifyAdminToken } = require('../middleware/verifyAdminToken');
const {
  createLand,
  getAllLands,
  getLandById,
  updateLand,
  deleteLand,
  getTrendingLands
} = require('./land.controller');

const router = express.Router();

// Land routes
router.get('/', getAllLands);
router.get('/trending', getTrendingLands);
router.post('/', verifyAdminToken, createLand);
router.get('/:id', getLandById);
router.put('/:id', verifyAdminToken, updateLand);
router.delete('/:id', verifyAdminToken, deleteLand);

module.exports = router;
