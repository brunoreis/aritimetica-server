import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType'
import { Membership as PrismaMembership } from '@prisma/client'
import type { MembershipRoleSource } from './MembershipRole'
import type { GroupSource } from './Group'

export type MembershipSource =
  | (PrismaMembership & {
      membershipRole?: MembershipRoleSource | null
      group?: GroupSource | null
    })
  | null

export const Membership = objectType({
  name: 'Membership',
  sourceType: {
    module: __filename,
    export: 'MembershipSource',
  },
  definition(t) {
    t.string('uuid')
    t.string('membershipRoleUuid')
    t.string('userUuid')
    t.string('groupUuid')
    t.field('group', {
      type: 'Group',
      resolve(root, _args, ctx: ContextType) {
        if (root?.group) {
          return root.group
        } else {
          if (root?.groupUuid) {
            const params = {
              where: {
                uuid: root.groupUuid,
              },
            }
            return ctx.prisma.group.findUnique(params)
          }
        }
        return null
      },
    })
    t.field('membershipRole', {
      type: 'MembershipRole',
      resolve(root, _args, ctx: ContextType) {
        if (root?.membershipRole) {
          return root.membershipRole
        } else {
          if (root?.membershipRoleUuid) {
            const params = {
              where: {
                uuid: root.membershipRoleUuid,
              },
            }
            return ctx.prisma.membershipRole.findUnique(params)
          }
        }
        return null
      },
    })
  },
})
