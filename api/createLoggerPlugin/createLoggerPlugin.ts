const path = '/graphql'
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon'
import { Logger } from 'pino'

import { ApolloServerPlugin } from 'apollo-server-plugin-base';

import { clean } from './clean'
import { inspect } from 'util'

import { 
  BaseContext, 
  WithRequired, 
  GraphQLRequestContext, 
  GraphQLRequestContextDidResolveOperation,
  GraphQLRequestListenerParsingDidEnd,
  GraphQLRequestListenerValidationDidEnd,
  GraphQLRequestContextExecutionDidStart, 
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestContextDidEncounterErrors, 
  GraphQLRequestListener 
} from 'apollo-server-plugin-base';

type TContext = {};

export type PluginDefinition = ApolloServerPlugin<TContext> | (() => ApolloServerPlugin<TContext>);

export const createLoggerPlugin = ({ logger }: { logger: Logger}): PluginDefinition  => ({
    async serverWillStart() {
      logger.info(`apollo:server will start on "${path}"...`)

      if (process.env.DEBUG?.match(/apollo:/)) {
        logger.level = 'debug'
      }

      return {
        async serverWillStop() {
          logger.info(`apollo:server will stop on "${path}"`)
        },
      }
    },

    
    requestDidStart(_requestContext: GraphQLRequestContext<BaseContext>): GraphQLRequestListener<BaseContext> | void {
      const apolloRequestUuid = uuidv4();
      const loggerWithSession = logger.child({ apolloRequestUuid });
      const started = DateTime.now();
    
      function logErrors(...errors: unknown[]) {
        for (const error of errors) {
          if (error instanceof Error) {
            loggerWithSession.error(`apollo:${error.name}: ${error.message}`);
          }
        }
      }
    
      loggerWithSession.info('apollo:request did start');
    
      return {

        executionDidStart({ operationName, operation }: GraphQLRequestContextExecutionDidStart<BaseContext>) {
          const typeName = operation?.operation || 'operation';
          loggerWithSession.info(`apollo:execution did start --- ${typeName} ${operationName}...`);
        },

        async didResolveSource({ source }: { source: string }) {
          loggerWithSession.info({ source }, 'apollo:didResolveSource');
        },
    
        async didResolveOperation({
          operation,
          operationName,
          request: { variables },
        }: GraphQLRequestContextDidResolveOperation<BaseContext>) {
          const cleanedVariableNames = ['password', 'token', 'captcha'];
          const params = inspect(clean(cleanedVariableNames, variables));
          const kind = operation?.operation || 'operation';
          const name = operationName || '';
          loggerWithSession.info({ kind, name, params }, `apollo:didResolveOperation > > > > > > > > > ${kind} ${name} < < < < < < < < <  `);
        },

        parsingDidStart(
          _requestContext: WithRequired<GraphQLRequestContext<TContext>, 'source' | 'queryHash'>
        ): void | GraphQLRequestListenerParsingDidEnd {
          // Access the required properties
          // const { source, queryHash } = requestContext;
      
          loggerWithSession.info('apollo:parsing did start');
      
          
          return async (error?: Error): Promise<void> => {
            if (error) {
              loggerWithSession.error('apollo:parsing failed:', error);
            } else {
              loggerWithSession.info('apollo:parsing did end');
            }
          };
        },      
        
        validationDidStart(): void | GraphQLRequestListenerValidationDidEnd {
          loggerWithSession.info('apollo:validation did start');
    
          return async (err?: ReadonlyArray<Error>) => {
            if (err && err.length > 0) {
              loggerWithSession.error('apollo:validation failed');
              logErrors(...err);
            } else {
              loggerWithSession.info('apollo:validation did end. Document cached.');
            }
          };
        },
    
        
    
        async willSendResponse({ operation, operationName }: GraphQLRequestContextWillSendResponse<BaseContext>) {
          const kind = operation?.operation || 'operation';
          const name = operationName || '';
          const duration = DateTime.now().diff(started).toMillis();
          loggerWithSession.info({ kind, name, duration }, `apollo:will send response > > > > > > > > > ${kind} ${name} < < < < < < < < <   in ${duration}ms`);
        },        

        async didEncounterErrors({ errors }: GraphQLRequestContextDidEncounterErrors<BaseContext>) {
          if (errors) logErrors(...errors);
        },

      };
    },
    
  })