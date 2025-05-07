const express = require('express');
const { verifyAdminToken } = require('../middleware/verifyAdminToken');
const {
  postLand,
  getAllLands,
  getSingleLand,
  UpdateLand,
  deleteALand
} = require('./land.controller');

const router = express.Router();

// Land management routes
router
  .route('/')
  .get(getAllLands)
  .post(verifyAdminToken, postLand);

router
  .route('/:id')
  .get(getSingleLand)
  .delete(verifyAdminToken, deleteALand);

router
  .route('/edit/:id')
  .put(verifyAdminToken, UpdateLand);

module.exports = router;
