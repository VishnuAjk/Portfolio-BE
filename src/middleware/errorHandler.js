const ApiError = require('../utils/ApiError');

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong';

  if (process.env.NODE_ENV !== 'test' && (!err.isOperational || statusCode >= 500)) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
};

module.exports = { notFoundHandler, errorHandler };
