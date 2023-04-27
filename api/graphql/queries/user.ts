import { ContextType } from '../../ContextType';
import { extendType, nonNull, stringArg } from 'nexus'
import getRequestedFields from '../getRequestedFields';
import { GraphQLResolveInfo } from 'graphql';


type IncludeFields = { memberships?: boolean | { include: { group: boolean } } }

const getIncludeFields = (requestedFields: string[]): IncludeFields => {
  const includeFields: IncludeFields = {}

  if (requestedFields.includes('memberships')) {
    includeFields.memberships = true

    if (requestedFields.includes('memberships.group')) {
      includeFields.memberships = {
        include: {
          group: true
        }
      }
    }
  }

  return includeFields
}

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('user', {
      type: 'User',
      args: {                                        
        uuid: nonNull(stringArg()),
      },
      authorize: (_root, args, ctx:ContextType) => ctx.auth.loggedIn(),
      resolve(_root, args, ctx, resolverInfo:GraphQLResolveInfo) {
        const requestedFields = getRequestedFields(resolverInfo)
        
        const includeFields = getIncludeFields(requestedFields)
        const params =  {
          include: {
            ...includeFields
          },
          where: {
            uuid: args.uuid
          }
        }
        return ctx.db.user.findUnique(params)
      }
    })
  },
})
