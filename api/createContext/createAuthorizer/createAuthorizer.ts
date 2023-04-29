import type { UserDataType } from '../UserDataType';
import { getMembershipsInGroup } from './getMembershipsInGroup';
import { hasPermission } from './hasPermission';

export const createAuthorizer = ({ loadUserData }: { loadUserData: () => Promise<UserDataType> }) => {
    return {
        loggedIn: async () => {
            const userData = await loadUserData();
            return userData.uuid !== 'annonymous'
        },
        hasGlobalPermission: async (permissionUuid:string) => {
            const groupUuid = 'app'
            const userData = await loadUserData();
            // get all app permissions, keep this method to see if it is needed in the other check
            const membershipsInGroup = getMembershipsInGroup(userData, groupUuid)
            // get all authenticated role permissions
            const has:boolean = hasPermission(membershipsInGroup, permissionUuid)
            return has
        },
        hasGroupPermission: async () => {
            const userData = await loadUserData();
            return false;
        },
        isCurrentUser: async (userUuid: string) => {
            const userData = await loadUserData();
            console.log('isCurrentUser')
            console.log(userData.uuid)
            console.log(userUuid)
            return userData.uuid === userUuid;
        }   
    };
}