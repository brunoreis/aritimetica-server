import { createPrismaClient } from '../../testHelpers'
import { createGroupForUser } from './createGroupForUser'
import { users, membershipRoles } from '../../seed-data'
import { Group, Membership } from '@prisma/client'

describe('createGroupForUser', () => {
  let prisma = createPrismaClient().prisma

  describe('create a group and a membership for the provided user', () => {
    const userUuid = users.user1.uuid
    const groupName = 'new group for user 1'
    let group: Group & {
      memberships: Membership[]
    }
    beforeAll(async () => {
      group = await createGroupForUser(prisma, userUuid, groupName)
    })
    it('create an uuid', async () => {
      expect(group.uuid).toBeTruthy()
    })
    it('assign the correct name', () => {
      expect(group.name).toBe(groupName)
    })
    it('create a membership', () => {
      expect(group.memberships.length).toBe(1)
    })

    it('create the membership for the correct group and user, with group_owner membershipRole', () => {
      expect(group.memberships[0].groupUuid).toBe(group.uuid)
      expect(group.memberships[0].userUuid).toBe(userUuid)
      expect(group.memberships[0].membershipRoleUuid).toBe(
        membershipRoles.group_owner.uuid,
      )
    })
  })
})
