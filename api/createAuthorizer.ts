import { UserDataType } from './UserDataType';
import { AuthorizerType } from './AuthorizerType';

function hasPermission(memberships: [], permissionUuid: string): boolean {
    return memberships.some(membership => {
      return membership.role.permissions.some(permission => {
        return permission.uuid === permissionUuid;
      });
    });
  }

const createAuthorizer = ({ loadUserData }: { loadUserData: () => Promise<UserDataType> }):AuthorizerType => {
    return {
        loggedIn: async () => {
            const userData = await loadUserData();
            return userData.uuid !== 'annonymous'
        },
        hasGlobalPermission: async (permissionUuid:string) => {
            const userData = await loadUserData();
            const memberships = userData.memberships.filter((membership) => membership.group.uuid = 'app')
            return hasPermission(memberships, permissionUuid)
        },
        hasGroupPermission: async () => {
            const userData = await loadUserData();
            return false;
        }
    };
}

export default createAuthorizer