// src/auth/auth.route.js (أو ما يشابه)
const express = require("express");
const { adminLogin, createUser, getUserProfile } = require('./user.controller');
const { verifyToken } = require('../middleware/verifyToken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Auth routes
router.post("/admin", adminLogin);
router.post("/register", createUser);

// Protected routes
router.get("/profile", verifyToken, getUserProfile);

module.exports = router;
