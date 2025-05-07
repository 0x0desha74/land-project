const express = require('express');
const Land = require('./land.model');
const { postLand, getAllLands, getSingleLand, UpdateLand, deleteALand } = require('./land.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');


const router = express.Router();

// post land 

router.post('/create-land', verifyAdminToken, postLand); 

// get all lands

router.get('/', getAllLands);




// single land endpoint

router.get('/:id', getSingleLand);

// update land endpoint
router.put('/edit/:id',verifyAdminToken, UpdateLand);

// delete land endpoint
router.delete('/:id',verifyAdminToken, deleteALand);



module.exports = router
