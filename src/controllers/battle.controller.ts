import { Request, Response } from 'express';

import * as repository from './../repositories/battle.repository';
import * as service from './../services/battle.service';
import AppLog from '../events/AppLog';

import { Fighter, ReqBody } from '../lib/battle';

async function newBattle(_req: Request, res: Response) {
  const { firstUser, secondUser }: ReqBody = res.locals.data;

  const [firstUserCount, secondUserCount] = await Promise.all([
    repository.fetchUserData(firstUser, {
      type: 'all',
      per_page: '100',
    }),
    repository.fetchUserData(secondUser, {
      type: 'all',
      per_page: '100',
    }),
  ]);

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
