import { sign } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ContextType } from '../../../createContext/ContextType'
import { extendType, nonNull, stringArg } from 'nexus'
import { GraphQLResolveInfo } from 'graphql'

const invalidLoginMessage = 'Invalid Email or password'
export const LoginMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('login', {
      type: 'LoginResponse',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      authorize: async (_root, _args, ctx: ContextType) => {
        const isNotLoggedIn = !(await ctx.auth.loggedIn())
        return isNotLoggedIn
      },
      async resolve(
        _root,
        args,
        ctx: ContextType,
        resolverInfo: GraphQLResolveInfo,
      ) {
        try {
          const query = {
            where: { email: args.email },
            include: {
              memberships: {
                include: {
                  membershipRole: { select: { uuid: true } },
                  group: true,
                },
              },
            },
          }

          const user = await ctx.prisma.user.findUnique(query)
          if (!user) {
            return { errorMessage: invalidLoginMessage }
          }

          const isValidPassword = await bcrypt.compare(
            args.password,
            user.password,
          )

          if (!isValidPassword) {
            return { errorMessage: invalidLoginMessage }
          }
          if (!process.env.JWT_SECRET_KEY) {
            ctx.logger.error('Please provide the JWT_SECRET_KEY')
          }
          const jwt = sign(
            { userUuid: user.uuid },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: '1h',
            },
          )
          ctx.currentUser.setUuid(user.uuid)

          return { jwt, screen: { user } }
        } catch (e) {
          ctx.logger.error(e)
          return {
            errorMessage:
              'An unexpected error has occurred. Please try again later.',
          }
        }
      },
    })
  },
})
