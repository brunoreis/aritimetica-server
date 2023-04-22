import { objectType } from 'nexus'
import { ContextType } from '../ContextType';

export const Membership = objectType({
  name: 'Membership',
  definition(t) {
    t.string('roleId')
    t.string('userId')
    t.string('groupId')
    t.field('group', {
        type: 'Group',
        resolve(root, _args, ctx:ContextType) {
          return ctx.db.group.findUnique({
            where:{
              id: root.groupId
            }
          })
        },
      })
  },
})