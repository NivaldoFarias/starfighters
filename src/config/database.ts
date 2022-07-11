import pg, { ClientConfig } from 'pg';

import AppLog from './../events/AppLog';
import './setup';

const { Client } = pg;
const connectionString = process.env.DATABASE_URL ?? '';
const databaseConfig: ClientConfig = { connectionString };

if (process.env.MODE === 'PROD') {
  databaseConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const client = new Client(databaseConfig);
exec();

async function exec() {
  try {
    await client.connect();
    AppLog.DATABASE('Connected to database');
  } catch (error) {
    AppLog.ERROR(`Interal error whilte connecting to database | ${error}`);
  }
}

export default client;
