import './../config/setup.js';

import * as repository from './../repositories/battle.repository.js';
import AppLog from '../events/AppLog.js';

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

function battle(
  firstUser: { username: string; count: number },
  secondUser: { username: string; count: number },
) {
  const output = {
    winner:
      firstUser.count > secondUser.count
        ? firstUser.username
        : secondUser.username,
    loser:
      firstUser.count > secondUser.count
        ? secondUser.username
        : firstUser.username,
    draw: firstUser.count === secondUser.count,
  };

  AppLog.MIDDLEWARE(`Battle results processed`);
  return output;
}

async function resolveBattle(
  firstUsername: string,
  secondUsername: string,
  results: any,
) {
  (await repository.checkIfFighterExists(firstUsername))
    ? await repository.updateFighter(firstUsername, results)
    : await repository.createFighter(firstUsername, results);

  (await repository.checkIfFighterExists(secondUsername))
    ? await repository.updateFighter(secondUsername, results)
    : await repository.createFighter(secondUsername, results);

  return AppLog.MIDDLEWARE(`Battle resolved`);
}

export { countStargazers, processUrl, battle, resolveBattle };
