import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';
import Prisma, {Permission as PrismaPermission, Role } from '@prisma/client';

export type PermissionSource = PrismaPermission & {
  roles?: Prisma.PrismaPromise<Role[]>
} 

export const Permission = objectType({
  name: 'Permission',
  sourceType: {
    module: __filename,
    export: 'PermissionSource'
  },
  definition(t) {
    t.string('uuid')
    t.list.field('roles', {
    type: 'Role',
      async resolve(root, _args, ctx: ContextType) {
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
            const roles = await ctx.prisma.role.findMany(params)
            return roles
          }
        }
        return null
      }
    })
  }
})
