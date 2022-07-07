import { Router } from 'express';

import {
  processData,
  usersExists,
} from './../middlewares/battle.middleware.js';
import * as controller from './../controllers/battle.controller.js';
import validateSchema from './../middlewares/schema.middleware.js';
import battleSchema from './../models/battle.model.js';

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
