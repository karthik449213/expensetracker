const { verifyToken } = require('../utils/generateToken');

/**
 * Middleware to protect routes with JWT authentication
 * Verifies token and attaches user ID to request
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login to continue.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
