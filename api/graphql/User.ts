import { objectType } from 'nexus'
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ContextType } from '../ContextType';
import { extendType, nonNull, stringArg } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('uuid')
    t.string('email')
    t.string('name')
    t.string('bio')
    t.string('password')
    t.string('role')
    t.list.field('memberships', {
      type: 'Membership',
      resolve(_root, args, ctx:ContextType) {
        return ctx.db.membership.findMany({
          where:{
            userId: _root.id
          }
        })
      },
    })
  },
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: 'User',
      authorize: (_root, _args, ctx:ContextType) => ctx.auth.loggedIn(),
      resolve(_root, _args, ctx) {
          return ctx.db.user.findMany()
      }
    })
  },
})

export const LoginResponse = objectType({
  name: 'LoginResponse',
  definition(t) {
    t.string('jwt')
    t.field('user', { type: 'User' })
  },
})

export const LoginMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('login', {
      type: 'LoginResponse',
      args: {                                        
        email: nonNull(stringArg()),                 
        password: nonNull(stringArg()),                  
      },
      async resolve(_root, args, ctx:ContextType) {
        const user = await ctx.db.user.findUnique({ where: { email: args.email } });
        if (!user) {
          throw new Error("Invalid Email or password");
        }
        const isValidPassword = await bcrypt.compare(args.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid email or Password");
        }
        const jwt = sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
        return { jwt, user };
      }
    })
  },
})

