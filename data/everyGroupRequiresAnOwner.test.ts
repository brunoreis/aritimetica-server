import { createPrismaClient } from '../testHelpers'
import { users, membershipRoles } from '../seed-data'
import { Group, Membership } from '@prisma/client'

describe('every group requires an owner', () => {
  let prisma = createPrismaClient().prisma

  describe('create_owner_membership_for_group postgres trigger', () => {
    it('a group cannot be created using the standard prisma create method', async () => {
      try {
        await prisma.group.create({
          data: {
            name: 'group',
          },
        })
      } catch (e: any) {
        expect(e.message).toMatch(
          /Invalid `prisma\.group\.create\(\)` invocation in/,
        )
      }
    })

    it('a group can be created by setting the aritimetica.group_owner_userUuid posgres config in the same transaction', async () => {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT set_config('aritimetica.group_owner_userUuid',${users.user1.uuid}, true)`
        await tx.group.create({
          data: {
            name: 'group',
          },
        })
      })
    })

    it('the group creation will also create the membership', async () => {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT set_config('aritimetica.group_owner_userUuid',${users.user1.uuid}, true)`
        const group = await tx.group.create({
          data: {
            name: 'group',
          },
          include: {
            memberships: true,
          },
        })
        expect(group.memberships.length).toBe(1)
      })
    })
  })
})
