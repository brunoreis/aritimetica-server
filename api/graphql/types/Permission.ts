import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType'
import { Permission as PrismaPermission } from '@prisma/client'
import type { RoleSource } from './Role'

export type PermissionSource =
  | (PrismaPermission & {
      roles?: RoleSource[]
    })
  | null

export const Permission = objectType({
  name: 'Permission',
  sourceType: {
    module: __filename,
    export: 'PermissionSource',
  },
  definition(t) {
    t.string('uuid')
    t.list.field('roles', {
      type: 'Role',
      async resolve(root, _args, ctx: ContextType) {
        if (root?.roles) {
          return root.roles
        } else {
          if (root?.uuid) {
            const params = {
              where: {
                permissions: {
                  some: {
                    uuid: root.uuid,
                  },
                },
              },
            }
            const roles = await ctx.prisma.role.findMany(params)
            return roles
          }
        }
        return null
      },
    })
  },
})
