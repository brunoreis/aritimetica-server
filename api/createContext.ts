import { db } from "./db";
import { PrismaClient } from "@prisma/client"
import { verify } from 'jsonwebtoken';
import authorizer, {Authorizer} from './authorizer';
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient();

export type Context = {
    db: PrismaClient;
    auth: Authorizer,
    userData?: {
        id: string;
    }
};

type ContextInput = {
  req: Request, 
  res: Response
}

export const createContext = async ({ req, res }: ContextInput ): Promise<Context> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    let userData = undefined;
    
    if (token) {
      try {
        const { userId } = verify(token, process.env.JWT_SECRET_KEY) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if(user) {
          userData = {
            id: userId
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    
    return {
      db,
      auth: authorizer({ userId: userData?.id }),
      userData
    };
};