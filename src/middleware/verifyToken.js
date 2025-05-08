const jwt = require('jsonwebtoken');

// Error response helper
const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Verify user token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return errorResponse(res, 401, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid token');
  }
};

// Verify admin token
const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return errorResponse(res, 401, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role !== 'admin') {
      return errorResponse(res, 403, 'Admin privileges required');
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid token');
  }
};

module.exports = {
  verifyToken,
  verifyAdminToken
}; 