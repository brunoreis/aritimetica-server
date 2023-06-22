import { PrismaClient } from '@prisma/client'

interface UserData {
  email: string
  name: string
  password: string
}

export const createUserIntoGroup = (
  prisma: PrismaClient,
  userData: UserData,
  groupUuid: string,
  membershipRoleUuid: string,
) =>
  prisma.user.create({
    data: {
      ...userData,
      memberships: {
        create: [
          {
            membershipRoleUuid: membershipRoleUuid,
            groupUuid: groupUuid,
          },
        ],
      },
    },
    include: {
      memberships: {
        include: {
          membershipRole: true,
          group: true,
        },
      },
    },
  })
