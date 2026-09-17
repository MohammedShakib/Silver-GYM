import { ApiError, ErrorCodes } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  // Handle Prisma errors roughly
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: {
        code: ErrorCodes.NOT_FOUND,
        message: 'Record not found'
      }
    });
  }

  res.status(500).json({
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An unexpected error occurred.'
    }
  });
};
