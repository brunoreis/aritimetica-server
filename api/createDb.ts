import { PrismaClient } from '@prisma/client'
import { Logger } from 'pino'

let dbInstance: PrismaClient;
let queryCount: number = 1;

const createDbWithLogging = ({ logger }: { logger: Logger}): PrismaClient => {
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
  })

  
  db.$on('query', (e) => {
    logger.info({ 
      prisma: {
        count: queryCount++,
        query: e.query,
        params: e.params,
        duration: e.duration
      }
    })
  })
  return db
}


const dbSingleton = ({ logger }: { logger: Logger}): PrismaClient => {
  if(!dbInstance) {
    dbInstance = createDbWithLogging({ logger });
    logger.info('Create new PrismaClient instance')
  }
  return dbInstance;
}

const createDb = ({ logger }: { logger: Logger }): PrismaClient => {
  const db = dbSingleton({ logger });
  return db
}

export default createDb
