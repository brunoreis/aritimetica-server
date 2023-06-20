import { ContextType } from '../../../createContext/ContextType'
import { extendType, nonNull, stringArg } from 'nexus'
import { permissions } from '../../../../seed-data'
import { createUserWithGroup } from '../../../../service'

export const CreateUserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createUser', {
      type: 'CreateUserResponse',
      args: {
        email: nonNull(stringArg()),
        name: nonNull(stringArg()),
        password: nonNull(stringArg()),
        addToGroupUuid: stringArg(),
      },
      authorize: async (_root, args, ctx: ContextType) => {
        if (args.addToGroupUuid) {
          const hasPermission = await ctx.auth.hasGroupPermission(
            args.addToGroupUuid,
            permissions.create_user_into_group.uuid,
          )
          return hasPermission
        } else {
          return true
        }
      },
      async resolve(_root, args, ctx: ContextType) {
        try {
          const user = createUserWithGroup(ctx.prisma, {
            name: args.name,
            email: args.email,
            password: args.password,
          })
          return { user }
        } catch (e: any) {
          if (e?.code == 'P2002' && e?.message.match(/email/)) {
            return { errorMessage: 'Duplicated email' }
          }
          return { errorMessage: 'There was an error creating your user.' }
        }
      },
    })
  },
})
