import { PrismaClient } from '@prisma/client'
import type { UserDataType } from '../UserDataType';
import { getMembershipsInGroup } from './getMembershipsInGroup';
import { hasPermission } from './hasPermission';

const getLoggedUserGroupUuids = (userData: UserDataType) => {
    const uuids = new Set<string>();
    userData.memberships.forEach( (membership) => {
        uuids.add(membership.group.uuid)
    });
    return Array.from(uuids)
}

const userHasMembershipInOneOfThisGroups = async (db:PrismaClient, userUuid:string, groupUuids: string[]) => {
    const membershipCount = await db.membership.count({
        where: { 
            AND: [
                { userUuid: userUuid },
                { 
                    groupUuid: {  in: groupUuids }
                }
            ]
        }
    })
    
    return membershipCount > 0;
};

export const createAuthorizer = ({ db, currentUserData }: { db:PrismaClient ,currentUserData: () => Promise<UserDataType> }) => {
    return {
        loggedIn: async () => {
            const userData = await currentUserData();
            return userData.uuid !== 'annonymous'
        },
        hasGlobalPermission: async (permissionUuid:string) => {
            const groupUuid = 'app'
            const userData = await currentUserData();
            // get all app permissions, keep this method to see if it is needed in the other check
            const membershipsInGroup = getMembershipsInGroup(userData, groupUuid)
            // get all authenticated role permissions
            const has:boolean = hasPermission(membershipsInGroup, permissionUuid)
            return has
        },
        shareGroupWithCurrentUser: async (userUuid: string) => {
            const userData = await currentUserData();
            const loggedUserGroupUuids = getLoggedUserGroupUuids(userData)
            return await userHasMembershipInOneOfThisGroups(db, userUuid, loggedUserGroupUuids);
        },
        hasGroupPermission: async (permissionUuid:string) => {
            const userData = await currentUserData();
            return false;
        },
        isCurrentUser: async (userUuid: string) => {
            const userData = await currentUserData();
            return userData.uuid === userUuid;
        }   
    };
}