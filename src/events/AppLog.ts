import chalk from 'chalk';

const CONTROLLER = (output: string = 'Something went wrong') => {
  console.log(chalk.bold.green(`[Controller] ${output}`));
};
const MIDDLEWARE = (text: string = 'Something went wrong') => {
  console.log(chalk.bold.magenta(`[Middleware] ${text}`));
};
const SERVER = (text: string = 'Something went wrong') => {
  console.log(chalk.bold.yellow(`[Server] ${text}`));
};
const DATABASE = (text: string = 'Something went wrong') => {
  console.log(chalk.bold.cyan(`[Database] ${text}`));
};
const ROUTE = (route: string = 'Something went wrong') => {
  console.log(chalk.bold.yellow(`[Route] ${route}`));
};
const ERROR = (error: string = 'Something went wrong') => {
  console.log(chalk.bold.red(`[Error] ${error}`));
};

const AppLog = { CONTROLLER, MIDDLEWARE, SERVER, DATABASE, ROUTE, ERROR };

export default AppLog;
