import { PrismaClient } from '@prisma/client';

export const fetchAuthenticatedPermissions = async (db: PrismaClient): Promise<{ uuid: string; }[]> => {
  return await db.permission.findMany({
    where: {
      roles: {
        some: {
          uuid: 'authenticated'
        }
      }
    }
  });
};
