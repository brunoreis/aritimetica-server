import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType'
import { Permission as PrismaPermission } from '@prisma/client'
import type { MembershipRoleSource } from './MembershipRole'

export type PermissionSource =
  | (PrismaPermission & {
      membershipRoles?: MembershipRoleSource[]
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
    t.list.field('membershipRoles', {
      type: 'MembershipRole',
      async resolve(root, _args, ctx: ContextType) {
        if (root?.membershipRoles) {
          return root.membershipRoles
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
            const membershipRoles = await ctx.prisma.membershipRole.findMany(
              params,
            )
            return membershipRoles
          }
        }
        return null
      },
    })
  },
})
