import { verify } from 'jsonwebtoken'
import { Request } from 'express'
import { ContextType } from './ContextType'
import { createAuthorizer } from './createAuthorizer/createAuthorizer'
import { CurrentUser } from './CurrentUser'
import { Logger } from 'pino'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

type ContextInput = {
  req: Request
}

const extractUserUuidFromAuthToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token) {
    try {
      const decodedToken = verify(
        token,
        process.env.JWT_SECRET_KEY,
      ) as unknown as { userUuid: string }
      return decodedToken.userUuid
    } catch (err) {
      // unable to verify the token
    }
  }
  return null
}

export const createContext =
  ({ logger, prisma }: { logger: Logger; prisma: PrismaClient }) =>
  async ({ req }: ContextInput): Promise<ContextType> => {
    const currentUser = CurrentUser(prisma)
    const userUuid = await extractUserUuidFromAuthToken(req)

    if (userUuid) {
      currentUser.setUuid(userUuid)
    }

    const reqId = uuidv4()

    return {
      prisma,
      auth: createAuthorizer({ prisma, currentUser, logger }),
      currentUser,
      logger: logger.child({ userUuid, reqId }),
    }
  }
