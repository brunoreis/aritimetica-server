import { cachedUserData as buildCachedUserData } from './cachedUserData'
import { PrismaClient } from '@prisma/client'
import { fetchUserData, UserDataQueryResult } from './fetchUserData'
import { createAuthenticatedMembership } from './createAuthenticatedMembership'
import { fetchAuthenticatedPermissions } from './fetchAuthenticatedPermissions'
import { deepFreeze } from './deepFreeze'
import type { UserDataType } from '../UserDataType'

const fetchAndAddAuthUserMemberships = async (
  user: Exclude<UserDataQueryResult, null>,
  prisma: PrismaClient,
): Promise<UserDataType> => {
  const permissions = await fetchAuthenticatedPermissions(prisma)
  const authenticatedMembership = createAuthenticatedMembership(permissions)
  const memberships = [...user.memberships, authenticatedMembership]
  return {
    ...user,
    memberships,
  }
}

const CurrentUser = (prisma: PrismaClient) => {
  let cachedUserData = buildCachedUserData()
  let currentUserUuid: string | undefined = undefined
  const set = (userUuid: string) => {
    currentUserUuid = userUuid
  }
  const get = async (): Promise<UserDataType> => {
    let user = null
    if (currentUserUuid) {
      const userData = cachedUserData.get(currentUserUuid)
      if (userData) {
        return userData
      }
      user = await fetchUserData(currentUserUuid, prisma)
    }
    const userData = user
      ? await fetchAndAddAuthUserMemberships(user, prisma)
      : {
          uuid: 'annonymous',
          email: '',
          name: '',
          memberships: [], // what are the memberships of an anonymous user?
        }
    const frozenUserData = deepFreeze(userData)
    cachedUserData.store(frozenUserData)
    return frozenUserData
  }
  return {
    get,
    set,
  }
}

export { CurrentUser }
