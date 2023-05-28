import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { createContext } from './createContext/createContext'
import { createDb } from './createDb'
import { createLoggerPlugin } from './createLoggerPlugin'
import { createLogger } from './createLogger'

const logger = createLogger();
const db = createDb({ logger })
const loggerPlugin = createLoggerPlugin({ logger })

export const server = new ApolloServer({ 
    schema, 
    context: createContext({ logger, db }), 
    introspection: true,
    plugins: [ loggerPlugin ]
})