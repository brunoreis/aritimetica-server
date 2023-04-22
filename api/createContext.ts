import { db } from "./db";
import { PrismaClient } from "@prisma/client"
import { verify } from 'jsonwebtoken';
import { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { UserDataType } from './UserDataType'
import { ContextType } from './ContextType'
import createAuthorizer from "./createAuthorizer";
dotenv.config()

const prisma = new PrismaClient();

type ContextInput = {
  req: Request, 
}

const extractUserIdFromAuthToken = (req: Request):string | null => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET_KEY) as unknown as { userId: string };
      return decodedToken.userId
    } catch (err) {
      // unable to verify the token
    }
  }
  return null;
}

const loadUserDataFromUserId = async (userId: string | null): Promise<UserDataType> => {
  if(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if(user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  } 
  return {
    id: 'annonymous',
    email: '',
    name: ''
  }
    
}

export const createContext = async ({ req }: ContextInput ): Promise<ContextType> => {
    const userId = extractUserIdFromAuthToken(req)
    const userData = await loadUserDataFromUserId(userId)
    return {
      db,
      auth: createAuthorizer({ userData }),
      userData
    };
};