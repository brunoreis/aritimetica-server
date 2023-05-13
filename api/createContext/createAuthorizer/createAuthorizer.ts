import { PrismaClient } from '@prisma/client'
import type { UserDataType } from '../UserDataType';
import { getMembershipsInGroup } from './getMembershipsInGroup';
import { hasPermission } from './hasPermission';
import { CurrentUser } from '../CurrentUser';

const getLoggedUserGroupUuids = (userData: UserDataType, permissionUuid?: string) => {
    const uuids = new Set<string>();
    userData.memberships.forEach( (membership) => {
        if(permissionUuid) {
            const membershipHasPermission = membership.role.permissions.find(({uuid}) => permissionUuid === uuid)
            if(membershipHasPermission) {
                uuids.add(membership.group.uuid)
            }
        } else {
            uuids.add(membership.group.uuid)
        }

    });
    return Array.from(uuids)
}

const userHasMembershipInOneOfThisGroups = async (db:PrismaClient, userUuid:string, groupUuids: string[]) => {
    const where = { 
        AND: [
            { userUuid: userUuid },
            { 
                groupUuid: {  in: groupUuids }
            }
        ]
    }
    const membershipCount = await db.membership.count({ where })
    return membershipCount > 0;
};


export const createAuthorizer = ({ db, currentUser }: { db:PrismaClient ,currentUser: ReturnType<typeof CurrentUser> }) => {
    return {
        loggedIn: async () => {
            const userData = await currentUser.get();
            return userData.uuid !== 'annonymous'
        },
        hasGlobalPermission: async (permissionUuid:string) => {
            const userData = await currentUser.get();
            // get all app permissions, keep this method to see if it is needed in the other check
            const membershipsInGroup = getMembershipsInGroup(userData, 'app')
            // get all authenticated role permissions
            const isAuthorized:boolean = hasPermission(membershipsInGroup, permissionUuid)
            return isAuthorized
        },
        shareGroupWithCurrentUser: async (userUuid: string) => {
            const userData = await currentUser.get();
            const loggedUserGroupUuids = getLoggedUserGroupUuids(userData)
            return await userHasMembershipInOneOfThisGroups(db, userUuid, loggedUserGroupUuids);
        },
        hasGroupPermissionInAGroupWithThisUser: async (permissionUuid:string, userUuid:string) => {
            const userData = await currentUser.get();
            const groupsWhereLoggedUserHasThisPermission = getLoggedUserGroupUuids(userData, permissionUuid)
            const isAuthorized =  await userHasMembershipInOneOfThisGroups(db, userUuid, groupsWhereLoggedUserHasThisPermission);
            return isAuthorized
        },
        isCurrentUser: async (userUuid: string) => {
            const userData = await currentUser.get();
            return userData.uuid === userUuid;
        }   
    };
}