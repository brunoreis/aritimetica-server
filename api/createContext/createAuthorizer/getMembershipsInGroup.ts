import type { UserDataType } from '../UserDataType';

export const getMembershipsInGroup = (userData: Readonly<UserDataType>, groupUuid: string) => {
    const isMembershipFromGroup = (membership: UserDataType['memberships'][number]) => membership.group.uuid === groupUuid;
    return userData.memberships.filter(isMembershipFromGroup)
}
