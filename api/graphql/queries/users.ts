import { ContextType } from '../../ContextType';
import { extendType } from 'nexus'
import { parseResolveInfo } from 'graphql-parse-resolve-info'

export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: 'User',
      authorize: (_root, _args, ctx:ContextType) => ctx.auth.loggedIn(),
      resolve(_root, _args, ctx, resolveInfo) {
        const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
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
