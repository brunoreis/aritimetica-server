import { PrismaClient, Prisma } from '@prisma/client'
import { users, permissions, roles, groups } from '../seed-data'
const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  // PERMISSIONS
  for (const permission of Object.values(permissions)) {
    await prisma.permission.create({ data: permission})
    console.log(`Permissions ${permission.uuid}`)
  }

  for (const role of Object.values(roles)) {
    await prisma.role.create({ data: role})
    console.log(`Role ${role.uuid}`)
  }

  for (const user of Object.values(users)) {
    await prisma.user.create({ data: user})
    console.log(`User ${user.email} - ${user.name}`)
  }

  const groupData: Prisma.GroupCreateInput[] = [
    ...Object.values(groups),
    {
      uuid: '5c5b0bf5-5f9d-49a1-bdc5-3bbda3a847af',
      name: 'Admin Default(Owned) Group',
    },
    {
      uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a',
      name: 'Teacher Default(Owned) Group',
    },
    {
      uuid: '95d3005c-18e1-4e9e-a034-e717d262d7ce',
      name: 'User 1 Default(Owned) Group',
    },
    {
      uuid: '2f60f81b-6d16-4c57-93a8-fd1a87926c25',
      name: 'User 2 Default(Owned) Group',
    },
  ]

  for (const group of groupData) {
    await prisma.group.create({ data: group})
    console.log(`Group ${group.name} - ${group.uuid}`)
  }

  const membershipData: Prisma.MembershipCreateInput[] = [
    {
      uuid: '8c2dc6f2-1885-4473-aa5f-1e92ebebbcf5',
      user: { connect: { uuid: users.admin.uuid } },
      group: { connect: { uuid: 'app' } },
      role: { connect: { uuid: roles.admin.uuid } },
    },
    {
      uuid: '3ed8c2d2-af04-4d87-b6f8-1a13829174ee',
      user: { connect: { uuid: users.unauthenticated.uuid } },
      group: { connect: { uuid: 'app' } },
      role: { connect: { uuid: roles.unauthenticated.uuid } },
    },
    {
      uuid: 'f3b3f174-14b3-4690-9b9a-330914a6f47e',
      user: { connect: { uuid: users.admin.uuid } },
      group: { connect: { uuid: '5c5b0bf5-5f9d-49a1-bdc5-3bbda3a847af' } },
      role: { connect: { uuid: roles.group_owner.uuid } },
    },
    {
      uuid: 'e4b4a41d-2d8c-4b32-a1c4-8530e7b8d4b3',
      user: { connect: { uuid: users.teacher.uuid } },
      group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
      role: { connect: { uuid: roles.group_owner.uuid } },
    },
    {
      uuid: 'e31edaf0-f59e-4a6a-9f79-1ee60dd92f38',
      user: { connect: { uuid: users.teacher.uuid } },
      group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
      role: { connect: { uuid: roles.teacher.uuid } },
    },
    {
      uuid: '997b3f6c-3d98-4a75-b207-63fc74c1fc57',
      user: { connect: { uuid: users.user1.uuid } },
      group: { connect: { uuid: '95d3005c-18e1-4e9e-a034-e717d262d7ce' } },
      role: { connect: { uuid: roles.group_owner.uuid } },
    },
    {
      uuid: '99f5d438-5b8a-4135-85d5-5e5a604f2e5a',
      user: { connect: { uuid: users.user1.uuid } },
      group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
      role: { connect: { uuid: roles.student.uuid } },
    },
    {
      uuid: 'f1c583f4-8b87-4f44-a34c-4cf7f1d58ab7',
      user: { connect: { uuid: users.user2.uuid } },
      group: { connect: { uuid: '2f60f81b-6d16-4c57-93a8-fd1a87926c25' } },
      role: { connect: { uuid: roles.group_owner.uuid } },
    },
    {
      uuid: '183e1686-432d-4242-a6d8-6b06a6e7c6d1',
      user: { connect: { uuid: users.user2.uuid } },
      group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
      role: { connect: { uuid: roles.student.uuid } },
    },
  ]

  for (const membership of membershipData) {
    await prisma.membership.create({ data: membership})
    console.log(`Membership ${membership.uuid}`)
  }

  const lessonData = [
    {
      uuid: '9d0d79a2-51a2-4712-953d-cc7c87faa3a1',
      title: 'Lesson 1',
      assignerUuid: users.teacher.uuid,
      assigneeUuid: users.user1.uuid,
    },
    {
      uuid: 'a558d78d-1dca-4f7c-8b96-c9d4a0454ec1',
      title: 'Lesson 2',
      assignerUuid: users.teacher.uuid,
      assigneeUuid: users.user1.uuid,
    },
    {
      uuid: 'c125f9e9-0a50-47a2-8e53-98f94c43afec',
      title: 'Lesson 3',
      assignerUuid: users.teacher.uuid,
      assigneeUuid: users.user1.uuid,
    },
    {
      uuid: '6a870fb6-ae06-43f3-8825-31d83148010e',
      title: 'Lesson 4',
      assignerUuid: users.teacher.uuid,
      assigneeUuid: users.user2.uuid,
    },
    {
      uuid: 'f82c04ec-3ed3-44a7-b17d-d65ce239e1e6',
      title: 'Lesson 5',
      assignerUuid: users.teacher.uuid,
      assigneeUuid: users.user2.uuid,
    },
  ];

  for (const lesson of lessonData) {
    await prisma.lesson.create({ data: lesson})
    console.log(`Lesson ${lesson.uuid}`)
  }

  console.log(`Seeding finished.`)
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
