const express = require('express');
const { create } = require('./order.model');
const { createAOrder, getOrderByEmail } = require('./order.controller');



const router = express.Router();

//create order endpoint

router.post("/", createAOrder);
// get orders by uder email 

router.get("/email/:email", getOrderByEmail);

module.exports = router;