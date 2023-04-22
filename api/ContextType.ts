import { UserDataType } from './UserDataType';
import { PrismaClient } from "@prisma/client"
import { AuthorizerType } from './AuthorizerType';

type ContextType = {
    db: PrismaClient;
    auth: AuthorizerType,
    userData: UserDataType
};

export type { ContextType }