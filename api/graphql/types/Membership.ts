import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';
import Prisma, { Membership as PrismaMembership } from '@prisma/client';
import type { RoleSource } from './Role';
import type { GroupSource } from './Group';

export type MembershipSource =  PrismaMembership & 
  {
    role?: Prisma.PrismaPromise<RoleSource> | null;
    group?: GroupSource | null;
  } | null


export const Membership = objectType({
  name: 'Membership',
  sourceType: {
    module: __filename,
    export: 'MembershipSource'
  },
  definition(t) {
    t.string('roleUuid')
    t.string('userUuid')
    t.string('groupUuid')
    t.field('group', {
      type: 'Group',
      resolve(root, _args, ctx: ContextType) {
        if (root?.group) {
          return root.group
        } else {
          if(root?.groupUuid) {
            const params = {
              where: {
                uuid: root.groupUuid
              }
            }
            return ctx.prisma.group.findUnique(params)
          }
        }
        return null
      }
    })
    t.field('role', {
      type: 'Role',
      resolve(root, _args, ctx: ContextType) {
        if (root?.role) {
          return root.role
        } else {
          if(root?.roleUuid) {
            const params = {
              where: {
                uuid: root.roleUuid
              }
            }
            return ctx.prisma.role.findUnique(params)
          }
        }
        return null
      }
    })
  }
})
