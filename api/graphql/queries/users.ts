import { ContextType } from '../../ContextType';
import { extendType } from 'nexus'
import { parseResolveInfo } from 'graphql-parse-resolve-info'

const getRequestedFields = (selections: readonly any[]): string[] => {
  const requestedFields: string[] = []
  for (const selection of selections) {
    console.log(selections)
    if (selection.kind === 'Field') {
      requestedFields.push(selection.name.value)
    } else if (selection.kind === 'FragmentSpread') {
      // Handle fragment spreads if necessary
    } else if (selection.kind === 'InlineFragment') {
      // Handle inline fragments if necessary
    } else if (selection.kind === 'SelectionSet') {
      requestedFields.push(...getRequestedFields(selection.selections))
    }
  }
  return requestedFields
}

export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: 'User',
      authorize: (_root, _args, ctx:ContextType) => ctx.auth.loggedIn(),
      resolve(_root, _args, ctx, resolverInfo) {

        const parsedResolveInfoFragment = parseResolveInfo(resolverInfo);
        let memberships:boolean | object = false;
        const membershipsRelation = parsedResolveInfoFragment?.fieldsByTypeName.User?.memberships;
        if(membershipsRelation) {
          memberships = true;
          const groupRelation = membershipsRelation.fieldsByTypeName.Membership?.group;
          if(groupRelation) {
            memberships = {
              include: {
                group: true
              }
            }
          }
        }
        const params =  {
          include: {
            memberships
          } 
        }
        return ctx.db.user.findMany(params)
      }
    })
  },
})
