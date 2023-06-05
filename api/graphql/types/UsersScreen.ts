import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';
import { GraphQLResolveInfo } from 'graphql';
import type { UserSource } from './User'

export type UsersScreenSource = {
  user: UserSource
}

export const UsersScreen = objectType({
  name: 'UsersScreen',
  sourceType: {
    module: __filename,
    export: 'UsersScreenSource'
  },
  definition(t) {
    t.field(
      'user', { 
        type: 'User',
        async resolve(root, _args, _ctx:ContextType, _resolverInfo:GraphQLResolveInfo) {
          return root.user
        }
      })
  },
})
