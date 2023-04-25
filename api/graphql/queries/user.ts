import { ContextType } from '../../ContextType';
import { extendType, nonNull, stringArg } from 'nexus'
import { parseResolveInfo } from 'graphql-parse-resolve-info'


const relation = (parsedNode,rootName,relationName) => {
  return parsedNode?.fieldsByTypeName[rootName][relationName]
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
        const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
        let memberships:boolean | object = false;

        const membershipsRelation = relation(parsedResolveInfoFragment,'User', 'memberships');
        if(membershipsRelation) {
          memberships = true;
          const groupRelation = relation(membershipsRelation,'Membership','group');
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
