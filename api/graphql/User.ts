import { objectType } from 'nexus'

import { extendType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('uuid')
    t.string('email')
    t.string('name')
    t.string('bio')
    t.string('password')
    t.string('role')
  },
})

export const UserQuery = extendType({
    type: 'Query',
    definition(t) {
      t.nonNull.list.field('users', {
        type: 'User',
        resolve(_root, _args, ctx) {
            return ctx.db.user.findMany()
        }
      })
    },
  })