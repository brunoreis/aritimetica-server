import { PrismaClient } from '@prisma/client'

export const fetchAuthenticatedPermissions = async (
  prisma: PrismaClient,
): Promise<{ uuid: string }[]> => {
  return await prisma.permission.findMany({
    where: {
      membershipRoles: {
        some: {
          uuid: 'authenticated',
        },
      },
    },
  })
}
