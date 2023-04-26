import { ContextType } from '../../ContextType';
import { extendType, nonNull, stringArg } from 'nexus'


const getRequestedFields = (selections: readonly any[], parentFieldName = ''): string[] => {
  const requestedFields: string[] = []
  for (const selection of selections) {
    if (selection.kind === 'Field') {
      const fieldName = parentFieldName ? `${parentFieldName}.${selection.name.value}` : selection.name.value
      requestedFields.push(fieldName)
      if (selection.selectionSet) {
        requestedFields.push(...getRequestedFields(selection.selectionSet.selections, fieldName))
      }
    } else if (selection.kind === 'FragmentSpread') {
      // Handle fragment spreads if necessary
    } else if (selection.kind === 'InlineFragment') {
      // Handle inline fragments if necessary
    }
  }
  return requestedFields
}

type IncludeFields = { memberships?: boolean | { include: { group: boolean } } }
const getIncludeFields = (requestedFields: string[]):IncludeFields  => {
  const includeFields: { memberships?: boolean | { include: { group: boolean } } } = {}
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

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('user', {
      type: 'User',
      args: {                                        
        uuid: nonNull(stringArg()),
      },
      authorize: (_root, args, ctx:ContextType) => ctx.auth.loggedIn(),
      resolve(_root, args, ctx, resolveInfo) {
        let requestedFields: string[] = []
        if(resolveInfo.fieldNodes[0].selectionSet) {
          requestedFields = getRequestedFields(resolveInfo.fieldNodes[0].selectionSet.selections)
        }
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
