import { PrismaClient } from '@prisma/client'
import { Logger } from 'pino'
import { createDbWithLogging } from './createDbWithLogging'

let dbInstance: PrismaClient

const dbSingleton = ({ logger }: { logger: Logger }): PrismaClient => {
  if (!dbInstance) {
    dbInstance = createDbWithLogging({ logger })
    logger.info('Create new PrismaClient instance')
  }
  return dbInstance
}

const createDb = ({ logger }: { logger: Logger }): PrismaClient => {
  const db = dbSingleton({ logger })
  return db
}

export { createDb }
