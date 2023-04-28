import type { UserDataType } from '../UserDataType';
import type { AuthorizerType } from '../../AuthorizerType';
import { getMembershipsInGroup } from './getMembershipsInGroup';
import { hasPermission } from './hasPermission';

const createAuthorizer = ({ loadUserData }: { loadUserData: () => Promise<UserDataType> }):AuthorizerType => {
    return {
        loggedIn: async () => {
            const userData = await loadUserData();
            return userData.uuid !== 'annonymous'
        },
        hasGlobalPermission: async (permissionUuid:string) => {
            const groupUuid = 'app'
            const userData = await loadUserData();
            const membershipsInGroup = getMembershipsInGroup(userData, groupUuid)
            return hasPermission(membershipsInGroup, permissionUuid)
        },
        hasGroupPermission: async () => {
            const userData = await loadUserData();
            return false;
        }
    };
}

export default createAuthorizer