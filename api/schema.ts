import { makeSchema, fieldAuthorizePlugin, plugin } from 'nexus'

import { join } from 'path'
import * as types from './graphql'

const logResolverExceptionsPlugin = plugin({
  name: 'LogResolverExceptionsPlugin',
  onCreateFieldResolver() {
    return async (root, args, ctx, info, next) => {
        try {
          const value = await next(root, args, ctx, info)
          return value
        } catch(e) {
          ctx.logger.error(e, 'Resolver Exception')
          throw e
        }
    }
  },
})

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'), // 2
    schema: join(__dirname, '..', 'schema.graphql'), // 3
  },
  plugins: [
    fieldAuthorizePlugin({ formatError: ({ error, ctx }) =>{
      ctx.logger.error(error)
      return error
    } }),
    logResolverExceptionsPlugin
  ],
})