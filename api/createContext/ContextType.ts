import { UserDataType } from './UserDataType';
import { PrismaClient } from "@prisma/client"
import { createAuthorizer } from './createAuthorizer/createAuthorizer';

type ContextType = {
    db: PrismaClient;
    auth: ReturnType<typeof createAuthorizer>,
    loadUserData: () => Promise<UserDataType>
};

export type { ContextType }