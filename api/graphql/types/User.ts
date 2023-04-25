import { objectType } from 'nexus'
import { ContextType } from '../../ContextType';

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