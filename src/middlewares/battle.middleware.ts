import { Request, Response, NextFunction } from 'express';

import * as repository from './../repositories/battle.repository.js';
import AppError from '../config/error.js';
import AppLog from '../events/AppLog.js';

function processData(req: Request, res: Response, next: NextFunction) {
  const { firstUser, secondUser } = req.body;

  res.locals.data = { firstUser, secondUser };
  AppLog.MIDDLEWARE(`Data processed`);
  return next();
}

function usersExists(_req: Request, res: Response, next: NextFunction) {
  const { firstUser, secondUser } = res.locals.data;

  const firstData = repository.fetchUser(firstUser);
  if (!firstData) {
    throw new AppError(
      `User '${firstUser}' not found`,
      404,
      `User '${firstUser}' not found`,
      'Ensure to provide a valid username',
    );
  }
  AppLog.MIDDLEWARE(`User '${firstUser}' found`);

  const secondData = repository.fetchUser(secondUser);
  if (!secondData) {
    throw new AppError(
      `User '${secondUser}' not found`,
      404,
      `User '${secondUser}' not found`,
      'Ensure to provide a valid username',
    );
  }

  AppLog.MIDDLEWARE(`User '${secondUser}' found`);
  return next();
}

export { processData, usersExists };
