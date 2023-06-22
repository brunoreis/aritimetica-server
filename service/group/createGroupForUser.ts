import { membershipRoles } from '../../seed-data'
import { PrismaClient } from '@prisma/client'

// this is probably doable with a related record creation syntax
// https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-related-record
// I was not able to do it though, and left with this transaction to have an example of a transaction in the
export const createGroupForUser = async (
  prisma: PrismaClient,
  userUuid: string,
  groupName: string,
) =>
  await prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: {
        name: groupName,
      },
    })
    const membership = await tx.membership.create({
      data: {
        userUuid: userUuid,
        membershipRoleUuid: membershipRoles.group_owner.uuid,
        groupUuid: group.uuid,
      },
      include: {
        group: true,
      },
    })

    return membership
  })
