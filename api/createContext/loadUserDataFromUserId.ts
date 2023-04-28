import { UserDataType } from './UserDataType';
import { PrismaClient } from '@prisma/client';

export const loadUserDataFromUserId = async (
  userUuid: string | null,
  db: PrismaClient
): Promise<UserDataType> => {
  console.log('*** *** *** loadUserDataFromUserId');
  if (userUuid) {
    const user = await db.user.findUnique({
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
                name: true
              }
            },
            role: {
              select: {
                uuid: true,
                permissions: true
              }
            }
          }
        }
      },
    });
    if (user) {
      return user;
    }
  }
  return {
    uuid: 'annonymous',
    email: '',
    name: '',
    memberships:[] // what are the memberships of an anonymous user?
  };
};
