import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ContextType } from '../../../createContext/ContextType';
import { extendType, nonNull, stringArg } from 'nexus'
import { GraphQLResolveInfo } from 'graphql';

export const LoginMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('login', {
      type: 'LoginResponse',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),                  
      },
      async resolve(_root, args, ctx:ContextType, resolverInfo:GraphQLResolveInfo) {
        const query = { 
          where: { email: args.email }, 
          include: {
            memberships: { 
              include: { 
                role: { select: { uuid: true }},
                group: true
              }
            }
          }
        }
        const user = await ctx.prisma.user.findUnique(query);
        if (!user) {
          return { errorMessage: "Invalid Email or password" };
        }
        const isValidPassword = await bcrypt.compare(args.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid email or Password");
        }
        const jwt = sign({ userUuid: user.uuid }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
        ctx.currentUser.set(user.uuid)
        return { jwt, screen: { user } };
      }
    })
  },
})

