interface Fighter {
  id: number;
  username: string;
  wins: number;
  losses: number;
  draws: number;
}

type ReqBody = {
  firstUser: string;
  secondUser: string;
};

type FighterBattleData = {
  [figther: string]: { username: string; stargazersCount: number };
};

type ApiData = {
  [x: string]: any;
};

export { Fighter, ReqBody, FighterBattleData, ApiData };
