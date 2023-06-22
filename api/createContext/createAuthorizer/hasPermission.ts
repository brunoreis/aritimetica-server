import { UserDataType } from '../UserDataType'

export const hasPermission = (
  memberships: UserDataType['memberships'],
  permissionUuid: string,
): boolean => {
  return memberships.some((membership) => {
    return membership.membershipRole.permissions.some((permission) => {
      return permission.uuid === permissionUuid
    })
  })
}
