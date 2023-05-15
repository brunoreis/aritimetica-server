import { PrismaClient } from '@prisma/client'
import { Logger } from 'pino'

let dbInstance: PrismaClient | undefined;

// this is probabaly generating mixed/wrong results
let logger: Logger;
const getLogger = ():Logger => {
  return logger;
}
export const setLogger = (l: Logger) => {
  logger = l

}
export const onQuery: (() => void) | undefined  = undefined;



const createDbWithLogging = (): PrismaClient => {
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
    const logger = getLogger()
    logger.info({ 
      prisma: {
        query: e.query,
        params: e.params,
        duration: e.duration
      }
    })
  })
  return db
}


const dbSingleton = ({ logger }: { logger: Logger}): PrismaClient => {
  setLogger(logger);
  if(!dbInstance) {
    logger.info('Create new PrismaClient instance')
    dbInstance = createDbWithLogging();
  }
  return dbInstance;
}

const createDb = ({ logger }: { logger: Logger }): PrismaClient => {
  const db = dbSingleton({ logger });
  return db
}

export default createDb
