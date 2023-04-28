import { PrismaClient } from '@prisma/client'

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
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
  })
  return db
}

const db = process.env.LOG_PRISMA_QUERIES == 'true'
  ? createDbWithLogging()
  : new PrismaClient()

const createDb = (): PrismaClient => {
  return db
}

export default createDb
