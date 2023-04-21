import { db } from "./db";
import { PrismaClient } from "@prisma/client"
import { verify } from 'jsonwebtoken';
import authorizer, {Authorizer} from './authorizer';
import { Request, Response } from 'express'
import * as dotenv from 'dotenv'
import { UserDataType } from './UserDataType'
dotenv.config()

const prisma = new PrismaClient();



export type Context = {
    db: PrismaClient;
    auth: Authorizer,
    userData: UserDataType
};

type ContextInput = {
  req: Request, 
  res: Response
}


const extractUserIdFromAuthToken = (req: Request):string | null => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET_KEY) as { userId: string };
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

export const createContext = async ({ req, res }: ContextInput ): Promise<Context> => {
    const userId = extractUserIdFromAuthToken(req)
    const userData = await loadUserDataFromUserId(userId)
    console.log({ userData })
    return {
      db,
      auth: authorizer({ userData }),
      userData
    };
};