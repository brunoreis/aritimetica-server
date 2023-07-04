import { PrismaClient } from '@prisma/client'

export const createGroupForUser = async (
  prisma: PrismaClient,
  userUuid: string,
  groupName: string,
  groupUuid?: string,
) =>
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('aritimetica.group_owner_userUuid',${userUuid}, true)`
    return await tx.group.create({
      data: {
        uuid: groupUuid,
        name: groupName,
      },
      include: {
        memberships: true,
      },
    })
  })
