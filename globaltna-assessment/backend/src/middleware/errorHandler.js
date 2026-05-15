/**
 * 404 handler — catches any request that didn't match a route.
 * Must be placed AFTER all route definitions.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global error handler.
 * Express identifies this as the error handler because it has 4 params (err, req, res, next).
 * All errors passed via next(error) land here.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    // Only expose stack traces in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
