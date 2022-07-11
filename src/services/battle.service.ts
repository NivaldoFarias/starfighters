import './../config/setup';

import * as repository from './../repositories/battle.repository';
import AppLog from '../events/AppLog';
import { AppError } from '../events/AppError';
import { FighterBattleData } from '../lib/battle';

function countStargazers(repositories: any[]) {
  const output = repositories.reduce(
    (stargazers, repository) =>
      stargazers + Number(repository.stargazers_count),
    0,
  );
  AppLog.MIDDLEWARE(`Stargazers counted`);
  return output;
}

function processUrl(user: string, queries?: any[], queriesType?: any[]) {
  const url = process.env.API_URL ?? 'https://api.github.com';

  let query = '';
  if (queries && queriesType) {
    query = queries
      .map(
        (query, index) =>
          `${index === 0 ? '?' : ''}${queriesType[index]}=${query}`,
      )
      .join('&');
  }

  const output = `${url}/users/${user}/repos${query}`;
  AppLog.MIDDLEWARE(`Url processed`);
  return output;
}

function battle(firstUser: FighterBattleData, secondUser: FighterBattleData) {
  const output = {
    winner:
      firstUser.stargazersCount > secondUser.stargazersCount
        ? firstUser.username
        : secondUser.username,
    loser:
      firstUser.stargazersCount > secondUser.stargazersCount
        ? secondUser.username
        : firstUser.username,
    draw: firstUser.stargazersCount === secondUser.stargazersCount,
  };

  AppLog.MIDDLEWARE(`Battle results processed`);
  return output;
}

async function resolveBattle(
  firstUsername: string,
  secondUsername: string,
  results: any,
) {
  try {
    const [firstUserBool, secondUserBool] = (await Promise.all([
      repository.checkIfFighterExists(firstUsername),
      repository.checkIfFighterExists(secondUsername),
    ])) as [boolean, boolean];

    await Promise.all([
      firstUserBool
        ? repository.updateFighter(firstUsername, results)
        : repository.createFighter(firstUsername, results),
      secondUserBool
        ? repository.updateFighter(secondUsername, results)
        : repository.createFighter(secondUsername, results),
    ]);
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

  return AppLog.MIDDLEWARE(`Battle resolved`);
}

export { countStargazers, processUrl, battle, resolveBattle };
