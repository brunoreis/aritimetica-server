import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ContextType } from '../../../createContext/ContextType';
import { extendType, nonNull, stringArg } from 'nexus'
import { GraphQLResolveInfo } from 'graphql';

export const CreateGroupMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createGroup', {
      type: 'CreateGroupResponse',
      args: {
        name: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx:ContextType, resolverInfo:GraphQLResolveInfo) {
        try {
            const group = await ctx.prisma.group.create({
                data: {
                    name: args.name,
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

