import { objectType } from 'nexus'
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ContextType } from '../../createContext/ContextType';
import { extendType, nonNull, stringArg } from 'nexus'

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
        const jwt = sign({ userUuid: user.uuid }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
        return { jwt, user };
      }
    })
  },
})

