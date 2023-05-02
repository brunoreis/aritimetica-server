import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';

interface MembershipRoot {
  roleUuid?: string | null
  userUuid?: string | null
  groupUuid?: string | null
  group?: {} | null
  role?: {} | null
}

export const Membership = objectType({
  name: 'Membership',
  definition(t) {
    t.string('roleUuid')
    t.string('userUuid')
    t.string('groupUuid')
    t.field('group', {
      type: 'Group',
      resolve(root: MembershipRoot, _args, ctx: ContextType) {
        if (root.group) {
          return root.group
        } else {
          if(root.groupUuid) {
            const params = {
              where: {
                uuid: root.groupUuid
              }
            }
            return ctx.db.group.findUnique(params)
          }
        }
        return null
      }
    })
    t.field('role', {
      type: 'Role',
      resolve(root: MembershipRoot, _args, ctx: ContextType) {
        if (root.role) {
          return root.role
        } else {
          if(root.roleUuid) {
            const params = {
              where: {
                uuid: root.roleUuid
              }
            }
            return ctx.db.role.findUnique(params)
          }
        }
        return null
      }
    })
  }
})
