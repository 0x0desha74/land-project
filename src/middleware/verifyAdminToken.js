const jwt = require('jsonwebtoken');

// Send error message
const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Check if user is admin
const verifyAdminToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return errorResponse(res, 401, 'Access denied. No token provided');
    }

    // Check token format
    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 401, 'Access denied. Invalid token format');
    }

    // Check if token is valid
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return errorResponse(res, 401, 'Access denied. Token has expired');
        }
        return errorResponse(res, 403, 'Access denied. Invalid token');
      }

      // Check if user is admin
      if (decoded.role !== 'admin') {
        return errorResponse(res, 403, 'Access denied. Admin privileges required');
      }

      // Add user info to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return errorResponse(res, 500, 'Internal server error during token verification');
  }
};

// Check if user is logged in
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return errorResponse(res, 401, 'Access denied. No token provided');
    }

    // Check token format
    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 401, 'Access denied. Invalid token format');
    }

    // Check if token is valid
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return errorResponse(res, 401, 'Access denied. Token has expired');
        }
        return errorResponse(res, 403, 'Access denied. Invalid token');
      }

      // Add user info to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return errorResponse(res, 500, 'Internal server error during token verification');
  }
};

module.exports = {
  verifyAdminToken,
  verifyToken
};