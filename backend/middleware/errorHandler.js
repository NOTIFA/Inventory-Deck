// Custom error class so controllers can throw errors with a specific HTTP status code.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Centralized error-handling middleware.
// Express recognizes this as an error handler because it takes 4 arguments.
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

// Catches unmatched routes (404).
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = { ApiError, errorHandler, notFound };
