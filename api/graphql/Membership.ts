import { objectType } from 'nexus'
import { ContextType } from '../ContextType';

export const Membership = objectType({
  name: 'Membership',
  definition(t) {
    t.string('roleUuid')
    t.string('userUuid')
    t.string('groupUuid')
    t.field('group', {
        type: 'Group',
        resolve(root, _args, ctx:ContextType) {
          if(root.group) {
            return root.group
          } else {
            const params = {
              where:{
                uuid: root.groupUuid
              }
            }
            return ctx.db.group.findUnique(params)
          }
        },
      })
  },
})