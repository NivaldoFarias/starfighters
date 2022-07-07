import { Request, Response, NextFunction } from 'express';

import AppLog from './AppLog.js';
import AppError from './../config/error.js';
function ExceptionHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const { log, statusCode, message, detail } = error;

  AppLog.ERROR(log);
  return error instanceof AppError
    ? res.status(statusCode).send({ message, detail })
    : res.status(500).send({
        message: `Internal server error`,
        detail: error,
      });
}

export { AppError };
export default ExceptionHandler;
