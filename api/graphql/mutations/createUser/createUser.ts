import bcrypt from 'bcrypt'
import { ContextType } from '../../../createContext/ContextType'
import { extendType, nonNull, stringArg } from 'nexus'
import { roles, permissions } from '../../../../seed-data'

const invalidLoginMessage = 'Invalid Email or password'

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
          const user = await ctx.prisma.$transaction(async (tx) => {
            const group = await tx.group.create({
              data: {
                name: 'Default',
              },
            })
            const user = await tx.user.create({
              data: {
                email: args.email,
                name: args.name,
                password: bcrypt.hashSync(
                  args.password,
                  await bcrypt.genSalt(),
                ),
                memberships: {
                  create: {
                    roleUuid: roles.group_owner.uuid,
                    groupUuid: group.uuid,
                  },
                },
              },
            })
            return user
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
