/**
 * @fileoverview Central Express error-handling middleware.
 * Catches errors thrown/forwarded from any route and formats
 * a consistent JSON response.
 */

/**
 * Express 4-argument error handler.
 * Must be registered AFTER all routes with app.use(errorHandler).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error('[ERROR]', err.stack || err.message);

    const statusCode = err.status || err.statusCode || 500;
    const message = err.expose ? err.message : 'Internal server error';

    res.status(statusCode).json({
        is_success: false,
        message,
    });
};

module.exports = errorHandler;
