// User routes
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdminToken } = require('../middleware/verifyToken');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
} = require('./user.controller');

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

// Admin routes
router.get("/", verifyAdminToken, getAllUsers);
router.delete("/:id", verifyAdminToken, deleteUser);

module.exports = router;
