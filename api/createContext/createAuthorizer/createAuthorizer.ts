import { PrismaClient } from '@prisma/client'
import type { UserDataType } from '../UserDataType'
import { getMembershipsInGroup } from './getMembershipsInGroup'
import { hasPermission } from './hasPermission'
import { CurrentUser } from '../CurrentUser'
import { Logger } from 'pino'
import { users, groups } from '../../../seed-data'

const getLoggedUserGroupUuids = (
  userData: UserDataType,
  permissionUuid?: string,
) => {
  const uuids = new Set<string>()
  userData.memberships.forEach((membership) => {
    if (permissionUuid) {
      const membershipHasPermission =
        membership.membershipRole.permissions.find(
          ({ uuid }) => permissionUuid === uuid,
        )
      if (membershipHasPermission) {
        uuids.add(membership.group.uuid)
      }
    } else {
      uuids.add(membership.group.uuid)
    }
  })
  return Array.from(uuids)
}

const userHasMembershipInOneOfThisGroups = async (
  prisma: PrismaClient,
  userUuid: string,
  groupUuids: string[],
) => {
  const where = {
    AND: [
      { userUuid: userUuid },
      {
        groupUuid: { in: groupUuids },
      },
    ],
  }
  const membershipCount = await prisma.membership.count({ where })
  return membershipCount > 0
}

export const createAuthorizer = ({
  prisma,
  currentUser,
  logger,
}: {
  prisma: PrismaClient
  currentUser: ReturnType<typeof CurrentUser>
  logger: Logger
}) => {
  return {
    loggedIn: async () => {
      const userData = await currentUser.get()
      const isLoggedIn = userData.uuid !== users.unauthenticated.uuid
      logger.info({ isLoggedIn }, 'auth:loggedId')
      return isLoggedIn
    },
    hasGlobalPermission: async (permissionUuid: string) => {
      const userData = await currentUser.get()
      // get all app permissions, keep this method to see if it is needed in the other check
      const membershipsInGroup = getMembershipsInGroup(
        userData,
        groups.app.uuid,
      )
      // get all authenticated membershipRole permissions
      const isAuthorized: boolean = hasPermission(
        membershipsInGroup,
        permissionUuid,
      )
      logger.info(
        { permissionUuid, isAuthorized },
        `auth:hasGlobalPermission - ${permissionUuid}`,
      )
      return isAuthorized
    },
    shareGroupWithCurrentUser: async (userUuid: string) => {
      const userData = await currentUser.get()
      const loggedUserGroupUuids = getLoggedUserGroupUuids(userData)
      const isAuthorized = await userHasMembershipInOneOfThisGroups(
        prisma,
        userUuid,
        loggedUserGroupUuids,
      )
      logger.info({ userUuid, isAuthorized }, 'auth:shareGroupWithCurrentUser')
      return isAuthorized
    },
    hasGroupPermission: async (groupUuid: string, permissionUuid: string) => {
      const userData = await currentUser.get()
      const groupUuids = getLoggedUserGroupUuids(userData, permissionUuid)
      return groupUuids.includes(groupUuid)
    },
    hasGroupPermissionInAGroupWithThisUser: async (
      permissionUuid: string,
      userUuid: string,
    ) => {
      const userData = await currentUser.get()
      const groupsWhereLoggedUserHasThisPermission = getLoggedUserGroupUuids(
        userData,
        permissionUuid,
      )
      const isAuthorized = await userHasMembershipInOneOfThisGroups(
        prisma,
        userUuid,
        groupsWhereLoggedUserHasThisPermission,
      )
      logger.info(
        { permissionUuid, userUuid, isAuthorized },
        `auth:hasGroupPermissionInAGroupWithThisUser ${permissionUuid}`,
      )
      return isAuthorized
    },
    isCurrentUser: async (userUuid: string) => {
      const userData = await currentUser.get()
      const isCurrentUser = userData.uuid === userUuid
      logger.info({ userUuid, isCurrentUser }, 'auth:isCurrentUser')
      return isCurrentUser
    },
  }
}
