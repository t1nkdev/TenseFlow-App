import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';

/**
 * Home route handler
 */
export const getHomeRoute: RequestHandler = (req, res) => {
  res.json({ message: "This is home route" });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
};

/**
 * Global error handler
 */
export const globalErrorHandler: ErrorRequestHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    details: err.message || 'An unexpected error occurred'
  });
}; 