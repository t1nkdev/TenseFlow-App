"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.notFoundHandler = exports.getHomeRoute = void 0;
/**
 * Home route handler
 */
const getHomeRoute = (req, res) => {
    res.json({ message: "This is home route" });
};
exports.getHomeRoute = getHomeRoute;
/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Global error handler
 */
const globalErrorHandler = (err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        details: err.message || 'An unexpected error occurred'
    });
};
exports.globalErrorHandler = globalErrorHandler;
