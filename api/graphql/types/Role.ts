import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';
import Prisma, {Role as PrismaRole } from '@prisma/client';
import type { MembershipSource } from './Membership'
import type { PermissionSource } from './Permission'

export type RoleSource = PrismaRole & {
  memberships?: Prisma.PrismaPromise<MembershipSource[]> | null
  permissions?: Prisma.PrismaPromise<PermissionSource[]> | null
} | null

export const Role = objectType({
  name: 'Role',
  sourceType: {
    module: __filename,
    export: 'RoleSource'
  },
  definition(t) {
    t.string('uuid')
    t.string('title')
    t.list.field('memberships', {
      type: 'Membership',
      async resolve(root, _args, ctx: ContextType) {
        if (root?.memberships) {
          return root.memberships
        } 
        else {
          if (root?.uuid) {
            const params = {
              where: {
                roleUuid: root.uuid ?? undefined // set roleUuid to undefined if uuid is null or undefined
              },
              include: {
                group: true,
                user: true
              }
            }
            return ctx.prisma.membership.findMany(params)
          }
        }
        return null
      },
    })
    t.list.field('permissions', {
      type: 'Permission',
      resolve(root, _args, ctx: ContextType) {
        if (root?.permissions) {
          return root.permissions
        } else {
          if (root?.uuid) {
            const params = {
              where: {
                roles: {
                  some: {
                    uuid: root.uuid
                  }
                }
              }
            }
            return ctx.prisma.permission.findMany(params)
          }
        }
        return null
      },
    })
  },
})
