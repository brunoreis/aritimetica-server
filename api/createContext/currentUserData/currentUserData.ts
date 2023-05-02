import { UserDataType } from '../UserDataType';
import { PrismaClient } from '@prisma/client';
import { createAuthenticatedMembership } from './createAuthenticatedMembership';
import { fetchUserData, UserDataQueryResult } from './fetchUserData';
import { fetchAuthenticatedPermissions } from './fetchAuthenticatedPermissions';
import { requestCachedUserData } from '../requestCachedUserData';


const fetchAndAddAuthUserMemberships = async (user: Exclude<UserDataQueryResult, null>, db: PrismaClient): Promise<UserDataType> => {
  const permissions = await fetchAuthenticatedPermissions(db);
  const authenticatedMembership = createAuthenticatedMembership(permissions);
  const memberships = [...user.memberships, authenticatedMembership];
  return {
    ...user,
    memberships
  };
}



export const currentUserData = async (userUuid: string | null, db: PrismaClient, cachedUserData: ReturnType<typeof requestCachedUserData>): Promise<UserDataType> => {
  let user = null;
  if(userUuid) {
    const userData = cachedUserData.get(userUuid);
    if(userData) {
      return userData;
    }
    user = await fetchUserData(userUuid, db);
  }
  const userData = user ? await fetchAndAddAuthUserMemberships(user, db) : {
    uuid: 'annonymous',
    email: '',
    name: '',
    memberships:[] // what are the memberships of an anonymous user?
  };
  cachedUserData.store(userData)
  return userData;
};
