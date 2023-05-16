import { PrismaClient } from '@prisma/client';
import { Logger } from 'pino';
import { queryLogMessage } from './queryLogMessage';
let queryCount = 1;

export const createDbWithLogging = ({ logger }: { logger: Logger; }): PrismaClient => {
  const db = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  });


  db.$on('query', (e) => {
    queryCount++
    logger.info(
      {
        prisma: {
          count: queryCount,
          query: e.query,
          params: e.params,
          duration: e.duration
        }
      },
      queryLogMessage({ count: queryCount, query: e.query })
    )
  });
  
  return db;
};
