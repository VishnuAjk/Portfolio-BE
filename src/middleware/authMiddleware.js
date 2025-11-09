const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { env } = require('../config/env');
const User = require('../models/User');

const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : null;

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub).select('-passwordHash');

    if (!user) {
      throw new ApiError(401, 'Invalid token');
    }

    req.user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(401, 'Authentication failed'));
  }
};

const requireOwner = (req, _res, next) => {
  if (!req.user || req.user.role !== 'owner') {
    return next(new ApiError(403, 'Owner permissions required'));
  }
  next();
};

module.exports = { protect, requireOwner };
