import { CurrentUser } from './CurrentUser';
import { PrismaClient } from "@prisma/client"
import { createAuthorizer } from './createAuthorizer/createAuthorizer';

type ContextType = {
    db: PrismaClient;
    auth: ReturnType<typeof createAuthorizer>,
    currentUser: ReturnType<typeof CurrentUser>
};

export type { ContextType }