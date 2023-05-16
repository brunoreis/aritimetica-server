import { ApolloServer } from 'apollo-server'
import { schema } from './schema'
import { createContext } from './createContext/createContext'
import { createDb } from './createDb'
import pino from 'pino'
import * as dotenv from 'dotenv'
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



const logger = pino({
    transport: { targets }
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