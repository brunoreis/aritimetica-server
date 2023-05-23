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
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });


  db.$on('info', (e) => {
    const logObject = {
      prisma: {
        target: e.target,
        timestamp: e.timestamp
      }
    };
    logger.info(
      logObject,
      `Prisma:${e.message}`
    )
  });

  db.$on('warn', (e) => {
    const logObject = {
      prisma: {
        target: e.target,
        timestamp: e.timestamp
      }
    }
    logger.info(logObject, `Prisma:WARN:${e.message}`)
  });

  db.$on('error', (e) => {
    const logObject = {
      prisma: {
        target: e.target,
        timestamp: e.timestamp
      }
    }
    logger.error(logObject, `Prisma:${e.message}`)
  });

  db.$on('query', (e) => {
    queryCount++
    const logObject = {
      prisma: {
        count: queryCount,
        target: e.target,
        timestamp: e.timestamp,
        query: e.query,
        params: e.params,
        duration: e.duration
      }
    }
    logger.info(logObject, queryLogMessage({ count: queryCount, query: e.query }))
  });
  
  return db;
};
