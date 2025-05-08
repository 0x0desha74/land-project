const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Error response helper
const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Success response helper
const successResponse = (res, status, message, data = null) => {
  const response = { message };
  if (data) response.data = data;
  return res.status(status).json(response);
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return errorResponse(res, 400, 'Email already in use');
    }

    const newUser = await User.create({
      ...req.body,
      password // Password will be hashed by model hook
    });
    
    const userData = newUser.toJSON();
    delete userData.password;
    
    return successResponse(res, 201, 'User registered successfully', userData);
  } catch (error) {
    console.error('Error registering user:', error);
    return errorResponse(res, 500, 'Failed to register user');
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Wrong password');
    }

    await user.updateLastLogin();
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    const userData = user.toJSON();
    delete userData.password;

    return successResponse(res, 200, 'Login successful', {
      token,
      user: userData
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return errorResponse(res, 500, 'Failed to login');
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    
    return successResponse(res, 200, 'User profile retrieved successfully', user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return errorResponse(res, 500, 'Failed to fetch user profile');
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.user.id },
      returning: true
    });
    
    if (!updated) {
      return errorResponse(res, 404, 'User not found');
    }
    
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    return successResponse(res, 200, 'User profile updated successfully', updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return errorResponse(res, 500, 'Failed to update user profile');
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    return successResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return errorResponse(res, 500, 'Failed to fetch users');
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return errorResponse(res, 404, 'User not found');
    }
    
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    return errorResponse(res, 500, 'Failed to delete user');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
}; 