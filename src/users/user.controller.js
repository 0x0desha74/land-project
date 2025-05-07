const User = require('./user.model');
const jwt = require('jsonwebtoken');

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

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin user
    const admin = await User.findOne({ username, role: 'admin' });
    if (!admin) {
      return errorResponse(res, 404, 'Admin not found');
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid password');
    }

    // Update last login
    await admin.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username, 
        role: admin.role 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Return success response
    return successResponse(res, 200, 'Authentication successful', {
      token,
      user: {
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return errorResponse(res, 500, 'Server error during login');
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return errorResponse(res, 400, 'Username already exists');
    }

    // Create new user
    const user = new User({ username, password, role });
    await user.save();

    return successResponse(res, 201, 'User created successfully', {
      username: user.username,
      role: user.role
    });
  } catch (error) {
    console.error('Create user error:', error);
    return errorResponse(res, 500, 'Failed to create user');
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    return successResponse(res, 200, 'User profile retrieved successfully', { user });
  } catch (error) {
    console.error('Get user profile error:', error);
    return errorResponse(res, 500, 'Failed to retrieve user profile');
  }
};

module.exports = {
  adminLogin,
  createUser,
  getUserProfile
}; 