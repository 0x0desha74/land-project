const User = require('./user.model');
const jwt = require('jsonwebtoken');

// Send error message
const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Send success message
const successResponse = (res, status, message, data = null) => {
  const response = { message };
  if (data) response.data = data;
  return res.status(status).json(response);
};

// Add new user
const createUser = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return errorResponse(res, 400, 'Email already in use');
    }

    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    
    return successResponse(res, 201, 'User added successfully', savedUser);
  } catch (error) {
    console.error('Error adding user:', error);
    return errorResponse(res, 500, 'Failed to add user');
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Wrong password');
    }

    await user.updateLastLogin();
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return successResponse(res, 200, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return errorResponse(res, 500, 'Failed to login');
  }
};

// Get user info
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    return successResponse(res, 200, 'User profile retrieved successfully', user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return errorResponse(res, 500, 'Failed to fetch user profile');
  }
};

// Update user info
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return errorResponse(res, 404, 'User not found');
    }
    
    return successResponse(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return errorResponse(res, 500, 'Failed to update user');
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  updateUser
}; 