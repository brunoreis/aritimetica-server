import { ContextType } from '../../../createContext/ContextType';
import { extendType, nonNull, stringArg } from 'nexus'

export const CreateGroupMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createGroup', {
      type: 'CreateGroupResponse',
      args: {
        name: nonNull(stringArg()),
      },
      description: `
        Creates a new group

        The current user will be added to the group as the group owner.

        **Requires Authentication**.
      `,
      authorize: (_root, _args, ctx:ContextType) => {
        ctx.logger.info('createGroup::authorize');
        return ctx.auth.loggedIn()
      },
      async resolve(_root, args, ctx:ContextType) {
        try {
            const currentUser = await ctx.currentUser.get()
            const group = await ctx.prisma.group.create({
                data: {
                    name: args.name,
                    memberships: {
                      create: 
                        {
                          roleUuid: 'group_owner',
                          userUuid: currentUser.uuid,
                        }
                      
                    }
                },
                include: {
                  memberships: true
                }
            })
            return { group }
        } catch(e) {
          ctx.logger.error(e)
          return { errorMessage: "An unexpected error has occurred. Please try again later." }
        }
      }
    })
  },
})

