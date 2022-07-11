import { Request, Response, NextFunction } from 'express';
import AppError from '../config/error';
import AppLog from '../events/AppLog';

function validateSchema(schema: any, endpoint: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    AppLog.ROUTE(endpoint);
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      throw new AppError(
        'Invalid Input',
        422,
        'Invalid Input',
        error.details.map((detail: any) => detail.message),
      );
    }

    AppLog.MIDDLEWARE('Schema validated');
    return next();
  };
}

export default validateSchema;
