import mongoose from 'mongoose';
import { Server } from 'http';
import config from './config/index';
import app from './app';
import { logger, errorLogger } from './shared/logger';

process.on('uncaughtException', err => {
  console.log('hello');

  errorLogger.error(err);
  process.exit(1);
});

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('Database is connecteed successfully');

    server = app.listen(config.port, () => {
      logger.info(`App listening on port ${config.port}`);
    });
  } catch (error) {
    errorLogger.error('Failed to connect database', error);
  }
  process.on('unhandledRejection', error => {
    console.log(error);

    if (server) {
      server.close();
      errorLogger.error(error);
      process.exit(1);
    } else {
      process.exit(1);
    }
  });
}

main();

process.on('SIGTERM', () => {
  logger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
