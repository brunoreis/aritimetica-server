import createDb from './createDb'
import { verify } from 'jsonwebtoken'
import { Request } from 'express'
import * as dotenv from 'dotenv'
import { UserDataType } from './UserDataType'
import { ContextType } from './ContextType'
import { createAuthorizer } from './createAuthorizer/createAuthorizer'
import { PrismaClient } from '@prisma/client'
import { currentUserData } from './currentUserData/currentUserData'
dotenv.config()

type ContextInput = {
  req: Request
}

const extractUserIdFromAuthToken = (req: Request): string | null => {
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

const createLoadUserData =
  (db: PrismaClient, req: Request) => async (): Promise<UserDataType> => {
    const userId = extractUserIdFromAuthToken(req)
    const userData = await currentUserData(userId, db)
    return userData
  }

export const createContext = async ({
  req,
}: ContextInput): Promise<ContextType> => {
  const db = createDb()
  const loadUserData = createLoadUserData(db, req)
  return {
    db,
    auth: createAuthorizer({ loadUserData }),
    loadUserData,
  }
}
