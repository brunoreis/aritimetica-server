import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';

interface RoleRoot {
  uuid?: string | null
  title?: string | null
  memberships?: {}[] | null
  permissions?: {}[] | null
}

export const Role = objectType({
  name: 'Role',
  definition(t) {
    t.string('uuid')
    t.string('title')
    t.list.field('memberships', {
      type: 'Membership',
      resolve(root: RoleRoot, _args, ctx: ContextType) {
        if (root.memberships) {
          return root.memberships
        } else {
          if (root.uuid) {
            const params = {
              where: {
                roleUuid: root.uuid ?? undefined // set roleUuid to undefined if uuid is null or undefined
              },
              include: {
                group: true,
                user: true
              }
            }
            return ctx.db.membership.findMany(params)
          }
        }
        return null
      },
    })
    t.list.field('permissions', {
      type: 'Permission',
      resolve(root: RoleRoot, _args, ctx: ContextType) {
        if (root.permissions) {
          return root.permissions
        } else {
          if (root.uuid) {
            const params = {
              where: {
                roles: {
                  some: {
                    uuid: root.uuid
                  }
                }
              }
            }
            return ctx.db.permission.findMany(params)
          }
        }
        return null
      },
    })
  },
})
