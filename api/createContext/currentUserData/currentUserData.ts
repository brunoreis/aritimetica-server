import { UserDataType } from '../UserDataType';
import { PrismaClient } from '@prisma/client';
import { createAuthenticatedMembership } from './createAuthenticatedMembership';
import { fetchUserData } from './fetchUserData/fetchUserData';
import { fetchAuthenticatedPermissions } from './fetchAuthenticatedPermissions';

export const currentUserData = async (userUuid: string, db: PrismaClient): Promise<UserDataType> => {
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
