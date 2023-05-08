import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';
import { GraphQLResolveInfo } from 'graphql';

export const UsersScreen = objectType({
  name: 'UsersScreen',
  definition(t) {
    t.field(
      'user', { 
        type: 'User',
        async resolve(_root, args, ctx:ContextType, resolverInfo:GraphQLResolveInfo) {
          return _root.user
        }
      })
  },
})
