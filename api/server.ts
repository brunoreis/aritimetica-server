import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { createContext } from './createContext/createContext'
import { createDb } from './createDb'
import { createLoggerPlugin } from './createLoggerPlugin'
import { createLogger } from './createLogger'

const logger = createLogger();
const prisma = createDb({ logger })
const loggerPlugin = createLoggerPlugin({ logger })

export const server = new ApolloServer({ 
    schema, 
    context: createContext({ logger, prisma }), 
    introspection: true,
    plugins: [ loggerPlugin ]
})