import pg, { ClientConfig } from 'pg';

import AppLog from './../events/AppLog.js';
import './setup.js';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL ?? '';
const databaseConfig: ClientConfig = { connectionString };

if (process.env.MODE === 'PROD') {
  databaseConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const client = new Client(databaseConfig);

try {
  await client.connect();
  AppLog.DATABASE('Connected to database');
} catch (error) {
  AppLog.ERROR(`Interal error whilte connecting to database | ${error}`);
}

export default client;
