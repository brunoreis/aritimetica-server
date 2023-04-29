import { UserDataType } from './UserDataType';
import { PrismaClient } from '@prisma/client';

type UserDataQueryResult = {
  uuid: string;
  email: string;
  name: string;
  memberships: {
    group: {
      uuid: string;
      name: string;
    };
    role: {
      uuid: string;
      permissions: {
        uuid: string;
      }[];
    };
  }[];
} | null;

const fetchUserData = async (userUuid: string, db: PrismaClient): Promise<UserDataQueryResult> => {
  return await db.user.findUnique({
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
};

const fetchAuthenticatedPermissions = async (db: PrismaClient): Promise<{ uuid: string }[]> => {
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

const createAuthenticatedMembership = (permissions: { uuid: string }[]): { group: { uuid: string; name: string }; role: { uuid: string; permissions: { uuid: string }[] } } => {
  return {
    group: {
      uuid: 'app',
      name: 'App'
    },
    role: {
      uuid: 'authenticated',
      permissions
    }
  };
};

export const loadUserDataFromUserId = async (userUuid: string, db: PrismaClient): Promise<UserDataType> => {
  const user = await fetchUserData(userUuid, db);

  if (user) {
    const permissions = await fetchAuthenticatedPermissions(db);
    const authenticatedMembership = createAuthenticatedMembership(permissions);
    const memberships = [...user.memberships, authenticatedMembership];

    return {
      ...user,
      memberships
    };
  }

  return {
    uuid: 'annonymous',
    email: '',
    name: '',
    memberships:[] // what are the memberships of an anonymous user?
  };
};
