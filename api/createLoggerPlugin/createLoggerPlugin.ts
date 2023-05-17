const path = '/graphql'
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon'
import { Logger } from 'pino'
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { clean } from './clean'
import { inspect } from 'util'

export type PluginDefinition = ApolloServerPlugin | (() => ApolloServerPlugin);

export const createLoggerPlugin = ({ logger }: { logger: Logger}): PluginDefinition  => ({
    async serverWillStart() {
      logger.info(`Starting GraphQL on "${path}"...`)

      if (process.env.DEBUG?.match(/apollo:/)) {
        logger.level = 'debug'
      }

      return {
        async serverWillStop() {
          logger.info(`Stopping GraphQL on "${path}"`)
        },
      }
    },
    
    async requestDidStart() {
      const apolloRequestUuid = uuidv4();
      const loggerWithSession = logger.child({ apolloRequestUuid })
      const started = DateTime.now()

      function logErrors(...errors: unknown[]) {
        for (const error of errors) {
          if (error instanceof Error) {
            loggerWithSession.error(`${error.name}: ${error.message}`)
            loggerWithSession.debug(error)
          }
        }
      }

      loggerWithSession.debug('Starting GraphQL request...')

      return {
        async didResolveSource({ source }) {
          loggerWithSession.trace(`Source:\n${source}`)
        },

        async didResolveOperation({
          operation,
          operationName,
          request: { variables },
        }) {
          const cleanedVariableNames = ['password', 'token', 'captcha']
          const params = inspect(clean(cleanedVariableNames, variables))
          const kind = operation?.operation || 'operation'
          const name = operationName || ''

          loggerWithSession.info(`Started > > > > > > > > > ${kind} ${name} < < < < < < < < <  `)
          loggerWithSession.info(`Parameters: ${params}`)
        },

        async didEncounterErrors({ errors }) {
          if (errors) logErrors(...errors)
        },

        async parsingDidStart() {
          loggerWithSession.debug('Parsing source...')

          return async (error) => {
            if (error) {
              loggerWithSession.error('Failed to parse source')
              logErrors(error)
            } else {
              loggerWithSession.debug('Parsing complete')
            }
          }
        },

        async validationDidStart() {
          loggerWithSession.debug('Validating GraphQL document...')

          return async (error) => {
            if (error) {
              loggerWithSession.error('Failed to validate GraphQL document')
              logErrors(error)
            } else {
              loggerWithSession.debug('Validation complete. Document cached.')
            }
          }
        },

        async executionDidStart({ operationName, operation }) {
          const typeName = operation?.operation || 'operation'
          loggerWithSession.debug(`Executing ${typeName} ${operationName}...`)
        },

        async willSendResponse({ operation, operationName }) {
          const kind = operation?.operation || 'operation'
          const name = operationName || ''
          const duration = DateTime.now().diff(started).toMillis()
          loggerWithSession.info(`Completed > > > > > > > > > ${kind} ${name} < < < < < < < < <   in ${duration}ms`)
        },
      }
    },
  })