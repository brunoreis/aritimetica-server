import { objectType } from 'nexus'
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ContextType } from '../ContextType';
import { extendType, nonNull, stringArg } from 'nexus'
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info'

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
      resolve(root, _args, ctx:ContextType) {
        if(root.memberships) {
          return root.memberships
        } else {
          return ctx.db.membership.findMany({
            where:{
              userUuid: root.uuid
            }
          })
        }
      },
    })
  },
})

export const UsersQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('users', {
      type: 'User',
      authorize: (_root, _args, ctx:ContextType) => ctx.auth.loggedIn(),
      resolve(_root, _args, ctx, resolveInfo) {
        const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
        let memberships:boolean | object = false;
        const membershipsRelation = parsedResolveInfoFragment?.fieldsByTypeName.User?.memberships;
        if(membershipsRelation) {
          memberships = true;
          const groupRelation = membershipsRelation.fieldsByTypeName.Membership?.group;
          if(groupRelation) {
            memberships = {
              include: {
                group: true
              }
            }
          }
        }
        const params =  {
          include: {
            memberships
          } 
        }
        return ctx.db.user.findMany(params)
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
        const jwt = sign({ userUuid: user.uuid }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
        return { jwt, user };
      }
    })
  },
})

