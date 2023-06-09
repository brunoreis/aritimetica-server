import { ContextType } from '../../createContext/ContextType'
import { extendType } from 'nexus'
import getRequestedFields from '../getRequestedFields'

// do we really need this query?

type IncludeFields = { memberships?: boolean | { include: { group: boolean } } }

const getIncludeFields = (requestedFields: string[]): IncludeFields => {
  const includeFields: IncludeFields = {}

  if (requestedFields.includes('memberships')) {
    includeFields.memberships = true

    if (requestedFields.includes('memberships.group')) {
      includeFields.memberships = {
        include: {
          group: true,
        },
      }
    }
  }

  return includeFields
}

export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: 'User',
      authorize: (_root, _args, ctx: ContextType) => {
        ctx.logger.info('users::authorize')
        return ctx.auth.loggedIn()
      },
      async resolve(_root, _args, ctx, resolverInfo) {
        const requestedFields = getRequestedFields(resolverInfo)
        const includeFields = getIncludeFields(requestedFields)
        const params = {
          include: {
            ...includeFields,
          },
        }
        const users = await ctx.prisma.user.findMany(params)
        return users
      },
    })
  },
})
