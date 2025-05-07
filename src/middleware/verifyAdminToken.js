const jwt = require('jsonwebtoken');

// Error response helper
const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

/**
 * Middleware to verify JWT token and admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyAdminToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return errorResponse(res, 401, 'Access denied. No token provided');
    }

    // Verify token format
    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 401, 'Access denied. Invalid token format');
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return errorResponse(res, 401, 'Access denied. Token has expired');
        }
        return errorResponse(res, 403, 'Access denied. Invalid token');
      }

      // Verify admin role
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

/**
 * Middleware to verify JWT token (for any authenticated user)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return errorResponse(res, 401, 'Access denied. No token provided');
    }

    // Verify token format
    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 401, 'Access denied. Invalid token format');
    }

    // Verify token
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