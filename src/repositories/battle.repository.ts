import axios, { AxiosRequestHeaders } from 'axios';
import SqlString from 'sqlstring';
import './../config/setup';

import client from '../config/database';
import * as service from './../services/battle.service';
import AppLog from '../events/AppLog';

import { AppError } from './../events/AppError';
import { Fighter } from '../lib/battle';

const HEADERS: AxiosRequestHeaders = {
  Accept: 'application/vnd.github+json',
};

async function fetchUserData(
  username: string,
  queries: { [query: string]: string },
) {
  const queryKeys = Object.keys(queries);
  const queryValues = Object.values(queries);
  const url = service.processUrl(username, queryKeys, queryValues);

  try {
    const response = await axios.get(url, HEADERS);

    const output = service.countStargazers(response.data);
    AppLog.MIDDLEWARE(`User '${username}' data fetched`);
    return output;
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(
        error.response.statusText,
        error.response.status,
        error.response.statusText,
        error.response.data.message,
      );
    } else console.log(error);
  }
}

async function fetchUser(username: string) {
  const url = process.env.API_URL ?? 'https://api.github.com';
  try {
    const response = await axios.get(`${url}/users/${username}`, HEADERS);

    const output = response.data;
    AppLog.MIDDLEWARE(`User '${username}' fetched`);
    return output;
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(
        error.response.statusText,
        error.response.status,
        error.response.statusText,
        error.response.data.message,
      );
    } else console.log(error);
  }
}

async function checkIfFighterExists(username: string) {
  const query = SqlString.format(`SELECT * FROM fighters WHERE username = ?`, [
    username,
  ]);
  const result = await client.query<Fighter>(query);

  const output = !!result.rowCount;
  AppLog.DATABASE(`Fighter instance checked`);
  return output;
}

async function createFighter(username: string, results: any) {
  const { winner, loser, draw } = results;
  const wins = winner === username ? 1 : 0;
  const losses = loser === username ? 1 : 0;
  const draws = draw ? 1 : 0;

  const query = SqlString.format(
    `INSERT INTO fighters 
      (username, wins, losses, draws)
    VALUES (?, ?, ?, ?)`,
    [username, wins, losses, draws],
  );
  await client.query(query);
  return AppLog.DATABASE(`Fighter instance created`);
}

async function updateFighter(username: string, results: any) {
  const { winner, draw } = results;
  const toUpdate = draw ? 'draws' : winner === username ? 'wins' : 'losses';
  const query = SqlString.format(
    `UPDATE fighters 
      SET ${toUpdate} = ${toUpdate} + 1
    WHERE username = ?`,
    [username],
  );
  await client.query(query);
  return AppLog.DATABASE(`Fighter instance updated`);
}

async function rankUsers() {
  const query = SqlString.format(
    `SELECT username, wins, losses, draws FROM fighters ORDER BY wins DESC, draws DESC`,
  );
  const result = await client.query<Fighter>(query);

  const output = result.rows;
  AppLog.DATABASE(`Users ranked`);
  return output;
}

export {
  fetchUser,
  fetchUserData,
  checkIfFighterExists,
  createFighter,
  updateFighter,
  rankUsers,
};
