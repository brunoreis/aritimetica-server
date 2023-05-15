import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { createContext } from './createContext/createContext'
import createDb from './createDb'
import pino from 'pino'
import * as dotenv from 'dotenv'
dotenv.config()

const logger = pino({
    level: process.env.LOG_LEVEL,
    transport: {
        target: 'pino-pretty'
    }
});



const db = createDb({ logger })

export const server = new ApolloServer({ 
    schema, 
    context: createContext({ logger, db }), 
    introspection: true,
    plugins: [
        {
          async serverWillStart() {
            logger.info('serverWillStart');
            return {
                async drainServer() {
                logger.info('drainServer');
                await db.$disconnect();
              },
            };
          },
        },
    ],
 })