import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';

interface PermissionRoot {
  uuid?: string | null
  roles?: {}[] | null
}

export const Permission = objectType({
  name: 'Permission',
  definition(t) {
    t.string('uuid')
    t.list.field('roles', {
      type: 'Role',
      resolve(root: PermissionRoot, _args, ctx: ContextType) {
        if (root.roles) {
          return root.roles
        } else {
          if (root.uuid) {
            const params = {
              where: {
                permissions: {
                  some: {
                    uuid: root.uuid
                  }
                }
              }
            }
            return ctx.db.role.findMany(params)
          }
        }
        return null
      }
    })
  }
})
