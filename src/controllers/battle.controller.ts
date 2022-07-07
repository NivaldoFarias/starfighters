import { Request, Response } from 'express';

import * as repository from './../repositories/battle.repository.js';
import * as service from './../services/battle.service.js';
import AppLog from '../events/AppLog.js';

async function newBattle(_req: Request, res: Response) {
  const { firstUser, secondUser } = res.locals.data;

  const firstUserCount = await repository.fetchUserData(firstUser, {
    type: 'all',
    per_page: '100',
  });
  const secondUserCount = await repository.fetchUserData(secondUser, {
    type: 'all',
    per_page: '100',
  });

  const firstUserObj = { username: firstUser, count: firstUserCount };
  const secondUserObj = { username: secondUser, count: secondUserCount };
  const results = service.battle(firstUserObj, secondUserObj);

  await service.resolveBattle(firstUser, secondUser, results);

  AppLog.CONTROLLER(`Results sent`);
  res.send(results);
}

async function listRanking(_req: Request, res: Response) {
  const users = await repository.rankUsers();

  AppLog.CONTROLLER(`Ranking sent`);
  res.send(users);
}

export { newBattle, listRanking };
