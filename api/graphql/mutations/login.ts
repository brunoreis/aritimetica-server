import { objectType } from 'nexus'
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ContextType } from '../../createContext/ContextType';
import { extendType, nonNull, stringArg, unionType } from 'nexus'
import getRequestedFields from '../getRequestedFields';
import { GraphQLResolveInfo } from 'graphql';

// Define union type for the two possible screen types
export const Screen = unionType({
  name: 'Screen',
  definition(t) {
    t.members('UsersScreen', 'LessonsScreen')
  },
  resolveType(value) {
    console.log('screen resolveType...')
    console.log({ value })
    const isTeacher = value.user.memberships.map( m => m.role.uuid).includes('teacher')
    return isTeacher ? 'UsersScreen' :  'LessonsScreen';
  },
})

export const LoginResponse = objectType({
  name: 'LoginResponse',
  definition(t) {
    t.string('jwt')
    t.field('screen', { type: Screen })
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
      async resolve(_root, args, ctx:ContextType, resolverInfo:GraphQLResolveInfo) {
        const requestedFields = getRequestedFields(resolverInfo);
        const user = await ctx.db.user.findUnique({ where: { email: args.email }, include: {
          memberships: { include: { role: { select: { uuid: true}}}}
        } });
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
        ctx.currentUser.set(user.uuid)
        return { jwt, screen: { user } };
      }
    })
  },
})

