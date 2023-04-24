import { PrismaClient } from '@prisma/client'


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
    console.log('log? ', db.___log)
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
})

const createDb = ():PrismaClient => {
    return db;
}

export default createDb