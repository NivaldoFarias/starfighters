import { Router } from 'express';

import { processData, usersExists } from './../middlewares/battle.middleware';
import * as controller from './../controllers/battle.controller';
import validateSchema from './../middlewares/schema.middleware';
import battleSchema from './../models/battle.model';

const battleRouter = Router();

battleRouter.post(
  '/battle',
  validateSchema(battleSchema, '/battle'),
  processData,
  usersExists,
  controller.newBattle,
);
battleRouter.get('/ranking', controller.listRanking);

export default battleRouter;
