import { ContextType } from '../../createContext/ContextType';
import { extendType, nonNull, stringArg } from 'nexus'
import getRequestedFields from '../getRequestedFields';
import { GraphQLResolveInfo } from 'graphql';
import { permissions } from '../../../seed-data'

type IncludeFields = {
  memberships?: boolean | { include: { group: boolean } }
  assignedLessons?: boolean | { include: { assignee: boolean, assigner: boolean } }
  // receivedLessons?: boolean | { include: { assignee: boolean, assigner: boolean } }
}

const getIncludeFields = (requestedFields: string[]): IncludeFields => {
  const includeFields: IncludeFields = {}

  if (requestedFields.includes('memberships')) {
    includeFields.memberships = true

    // if (requestedFields.includes('memberships.group')) {
    //   includeFields.memberships = {
    //     include: {
    //       group: true
    //     }
    //   }
    // }
  }

  if (requestedFields.includes('assignedLessons')) {
    includeFields.assignedLessons = true
    if (requestedFields.includes('assignedLessons.assignee') || requestedFields.includes('assignedLessons.assigner')) {
      includeFields.assignedLessons = {
        include: {
          assignee: requestedFields.includes('assignedLessons.assignee'),
          assigner: requestedFields.includes('assignedLessons.assigner')
        }
      }
    }
  }

  // if (requestedFields.includes('receivedLessons')) {
  //   includeFields.receivedLessons = true
  // }
  
  return includeFields
}

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('user', {
      type: 'User',
      args: {                                        
        userUuid: nonNull(stringArg()),
      },
      authorize: async (_root, args, ctx:ContextType) => {
        return await ctx.auth.hasGlobalPermission(permissions.view_all_users.uuid) || 
        (await ctx.auth.hasGlobalPermission(permissions.view_my_user.uuid) && await ctx.auth.isCurrentUser(args.userUuid)) ||
        (await ctx.auth.hasGlobalPermission(permissions.view_users_of_my_groups.uuid) && await ctx.auth.shareGroupWithCurrentUser(args.userUuid))
      },
      resolve: async(_root, args, ctx:ContextType, resolverInfo:GraphQLResolveInfo) => {
        const requestedFields = getRequestedFields(resolverInfo)  
        const includeFields = getIncludeFields(requestedFields)
        const params =  {
          include: {
            ...includeFields
          },
          where: {
            uuid: args.userUuid
          }
        }
        return ctx.prisma.user.findUnique(params)
      }
    })
  },
})
