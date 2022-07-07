import { Request, Response } from 'express';

import AppLog from './events/AppLog.js';
import app from './app.js';
import './config/setup.js';

const PORT = process.env.PORT || 5000;

app.get('/', async (_req: Request, res: Response) => res.send('Online'));
app.listen(PORT, () => {
  AppLog.SERVER(`Server running on port ${PORT}`);
});
