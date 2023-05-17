import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { createContext } from './createContext/createContext'
import { createDb } from './createDb'
import pino from 'pino'
import * as dotenv from 'dotenv'
import { createLoggerPlugin } from './createLoggerPlugin'


dotenv.config()

const targets = [
  { 
    target: 'pino-pretty',
    level: process.env.LOG_LEVEL,
    options: {}
  },
];

if (process.env.LOGTAIL_TOKEN) {
  targets.push({ 
    target: "@logtail/pino",
    options: { sourceToken: process.env.LOGTAIL_TOKEN },
    level: process.env.LOG_LEVEL,
  });
}

const pinoLogger = pino({
    transport: { targets }
});
const logger = pinoLogger.child({ env: process.env.NODE_ENV });
const db = createDb({ logger })

const loggerPlugin = createLoggerPlugin({ logger })

export const server = new ApolloServer({ 
    schema, 
    context: createContext({ logger, db }), 
    introspection: true,
    plugins: [ loggerPlugin ]
 })