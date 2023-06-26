import { execSync } from 'child_process'
import { GraphQLClient } from 'graphql-request'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'
import { sign } from 'jsonwebtoken'

export async function createClient() {
  const client = new GraphQLClient(`http://localhost:${process.env.PORT}`)
  return client
}

export async function createPrismaClient() {
  const prismaBinary = join(__dirname, 'node_modules', '.bin', 'prisma')
  const cmd = `DATABASE_URL=${process.env.DATABASE_URL} ${prismaBinary} db push`
  execSync(cmd)
  const prisma = new PrismaClient()
  return { prisma }
}

export function closePrismaClient(prismaClient?: PrismaClient) {
  prismaClient?.$disconnect()
}

export function createAuthJwt(userUuid: string) {
  if (process.env.JWT_SECRET_KEY) {
    return sign({ userUuid }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    })
  }
}
