// User routes
const express = require("express");
const { createUser, loginUser, getUserProfile, updateUser } = require('./user.controller');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();

// Public routes
router.post("/register", createUser);
router.post("/login", loginUser);

// Private routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUser);

module.exports = router;
