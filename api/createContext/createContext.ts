import { verify } from 'jsonwebtoken'
import { Request } from 'express'
import * as dotenv from 'dotenv'
import { ContextType } from './ContextType'
import { createAuthorizer } from './createAuthorizer/createAuthorizer'
import { CurrentUser } from './CurrentUser'
import { Logger } from 'pino'
import { PrismaClient } from '@prisma/client'

dotenv.config()

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

export const createContext = ({ logger, db }: { logger: Logger, db: PrismaClient}) => async ({
  req,
}: ContextInput): Promise<ContextType> => {
  const currentUser = CurrentUser(db);
  const userUuid = await extractUserUuidFromAuthToken(req)

  if(userUuid) {
    currentUser.set(userUuid)
  }
  
  return {
    db,
    auth: createAuthorizer({ db, currentUser }),
    currentUser,
    logger: logger.child({ userUuid })
  }
}
