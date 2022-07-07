import express from 'express';

import battleRouter from './battle.router.js';

const router = express.Router();
router.use(battleRouter);

export default router;
