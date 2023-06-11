import { PrismaClient } from '@prisma/client'
import { UserDataQueryResult } from './UserDataQueryResult'

export const fetchUserData = async (
  userUuid: string,
  prisma: PrismaClient,
): Promise<UserDataQueryResult> => {
  return await prisma.user.findUnique({
    where: { uuid: userUuid },
    select: {
      uuid: true,
      email: true,
      name: true,
      memberships: {
        select: {
          group: {
            select: {
              uuid: true,
              name: true,
            },
          },
          role: {
            select: {
              uuid: true,
              permissions: true,
            },
          },
        },
      },
    },
  })
}
