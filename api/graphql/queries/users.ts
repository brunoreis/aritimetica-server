import { ContextType } from '../../createContext/ContextType';
import { extendType } from 'nexus'
import getRequestedFields from '../getRequestedFields';


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

export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: 'User',
      authorize: (_root, _args, ctx:ContextType) => ctx.auth.loggedIn(),
      resolve(_root, _args, ctx, resolverInfo) {
        const requestedFields = getRequestedFields(resolverInfo)
        const includeFields = getIncludeFields(requestedFields)
        const params =  {
          include: {
            ...includeFields
          } 
        }
        return ctx.db.user.findMany(params)
      }
    })
  },
})
