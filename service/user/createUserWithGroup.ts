import bcrypt from 'bcrypt'
import { roles } from '../../seed-data'
import { PrismaClient } from '@prisma/client'

interface UserData {
  uuid?: string
  email: string
  name: string
  password: string
}

export const createUserWithGroup = async (
  prisma: PrismaClient,
  userData: UserData,
) =>
  await prisma.$transaction(async (tx) => {
    const group = await tx.group.create({
      data: {
        name: 'Default',
      },
    })
    const user = await tx.user.create({
      data: {
        uuid: userData.uuid,
        email: userData.email,
        name: userData.name,
        password: bcrypt.hashSync(userData.password, await bcrypt.genSalt()),
        memberships: {
          create: {
            roleUuid: roles.group_owner.uuid,
            groupUuid: group.uuid,
          },
        },
      },
      include: {
        memberships: true,
      },
    })
    return user
  })
