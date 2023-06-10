import { ServerInfo } from "apollo-server";
import getPort, { makeRange } from "get-port";
import { execSync } from "child_process";
import { GraphQLClient } from "graphql-request";
import { server } from "./server";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

export async function createServerAndClient() {
  let serverInstance: ServerInfo | null = null;
  const port = await getPort({ port: makeRange(4000, 6000) });  
  serverInstance = await server.listen({ port });      
  const client = new GraphQLClient(`http://localhost:${port}`);
  return { serverInstance , client };
}

export async function createPrismaClient() {
  const prismaBinary = join(__dirname, "..", "node_modules", ".bin", "prisma");
  let prismaClient: null | PrismaClient = null;
  const cmd = `DATABASE_URL=${process.env.DATABASE_URL} ${prismaBinary} db push`;
  // use this to debug
  //execSync(cmd,{stdio: 'inherit'});
  execSync(cmd);
  console.log('exec sync... 2')
  const prisma = new PrismaClient();
  return { prisma };
}

export async function closeServer(serverInstance?:ServerInfo) {
  serverInstance?.server.close();
}

export function closePrismaClient(prismaClient?:PrismaClient) {
  prismaClient?.$disconnect();
}

