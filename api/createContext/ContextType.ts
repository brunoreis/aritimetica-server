import { CurrentUser } from './CurrentUser';
import { PrismaClient } from "@prisma/client"
import { createAuthorizer } from './createAuthorizer/createAuthorizer';
import { Logger } from 'pino'

type ContextType = {
    db: PrismaClient;
    auth: ReturnType<typeof createAuthorizer>,
    currentUser: ReturnType<typeof CurrentUser>
    logger: Logger
};

export type { ContextType }