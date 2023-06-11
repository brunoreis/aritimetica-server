import { PrismaClient, Prisma } from '@prisma/client'
import { users, permissions, roles } from '../seed-data'
const prisma = new PrismaClient()

const permissionData: Prisma.PermissionCreateInput[] = Object.values(permissions)
const roleData: Prisma.RoleCreateInput[] = Object.values(roles)
const userData: Prisma.UserCreateInput[] = Object.values(users)

const groupData: Prisma.GroupCreateInput[] = [
  {
    uuid: 'app',
    name: 'App',
  },
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

const membershipData: Prisma.MembershipCreateInput[] = [
  {
    uuid: '8c2dc6f2-1885-4473-aa5f-1e92ebebbcf5',
    user: { connect: { email: 'admin@example.com' } },
    group: { connect: { uuid: 'app' } },
    role: { connect: { uuid: 'admin' } },
  },
  {
    uuid: '3ed8c2d2-af04-4d87-b6f8-1a13829174ee',
    user: { connect: { email: 'unauthenticated@example.com' } },
    group: { connect: { uuid: 'app' } },
    role: { connect: { uuid: 'unauthenticated' } },
  },
  {
    uuid: 'f3b3f174-14b3-4690-9b9a-330914a6f47e',
    user: { connect: { email: 'admin@example.com' } },
    group: { connect: { uuid: '5c5b0bf5-5f9d-49a1-bdc5-3bbda3a847af' } },
    role: { connect: { uuid: 'group_owner' } },
  },
  {
    uuid: 'e4b4a41d-2d8c-4b32-a1c4-8530e7b8d4b3',
    user: { connect: { email: 'teacher@example.com' } },
    group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
    role: { connect: { uuid: 'group_owner' } },
  },
  {
    uuid: 'e31edaf0-f59e-4a6a-9f79-1ee60dd92f38',
    user: { connect: { email: 'teacher@example.com' } },
    group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
    role: { connect: { uuid: 'teacher' } },
  },
  {
    uuid: '997b3f6c-3d98-4a75-b207-63fc74c1fc57',
    user: { connect: { email: 'user1@example.com' } },
    group: { connect: { uuid: '95d3005c-18e1-4e9e-a034-e717d262d7ce' } },
    role: { connect: { uuid: 'group_owner' } },
  },
  {
    uuid: '99f5d438-5b8a-4135-85d5-5e5a604f2e5a',
    user: { connect: { email: 'user1@example.com' } },
    group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
    role: { connect: { uuid: 'student' } },
  },
  {
    uuid: 'f1c583f4-8b87-4f44-a34c-4cf7f1d58ab7',
    user: { connect: { email: 'user2@example.com' } },
    group: { connect: { uuid: '2f60f81b-6d16-4c57-93a8-fd1a87926c25' } },
    role: { connect: { uuid: 'group_owner' } },
  },
  {
    uuid: '183e1686-432d-4242-a6d8-6b06a6e7c6d1',
    user: { connect: { email: 'user2@example.com' } },
    group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
    role: { connect: { uuid: 'student' } },
  },
]

const lessonData = [
  {
    uuid: '9d0d79a2-51a2-4712-953d-cc7c87faa3a1',
    title: 'Lesson 1',
    assignerUuid: 'cfd7d883-93a6-4f15-b7a8-cba0ffc52363',
    assigneeUuid: 'c1f875d9-1889-42f3-8c3b-5f5aa35d1a5f',
  },
  {
    uuid: 'a558d78d-1dca-4f7c-8b96-c9d4a0454ec1',
    title: 'Lesson 2',
    assignerUuid: 'cfd7d883-93a6-4f15-b7a8-cba0ffc52363',
    assigneeUuid: 'c1f875d9-1889-42f3-8c3b-5f5aa35d1a5f',
  },
  {
    uuid: 'c125f9e9-0a50-47a2-8e53-98f94c43afec',
    title: 'Lesson 3',
    assignerUuid: 'cfd7d883-93a6-4f15-b7a8-cba0ffc52363',
    assigneeUuid: 'c1f875d9-1889-42f3-8c3b-5f5aa35d1a5f',
  },
  {
    uuid: '6a870fb6-ae06-43f3-8825-31d83148010e',
    title: 'Lesson 4',
    assignerUuid: 'cfd7d883-93a6-4f15-b7a8-cba0ffc52363',
    assigneeUuid: 'a918c10a-6d89-4f67-b814-14b86c9e60d2',
  },
  {
    uuid: 'f82c04ec-3ed3-44a7-b17d-d65ce239e1e6',
    title: 'Lesson 5',
    assignerUuid: 'cfd7d883-93a6-4f15-b7a8-cba0ffc52363',
    assigneeUuid: 'a918c10a-6d89-4f67-b814-14b86c9e60d2',
  },
];

async function main() {
  console.log(`Start seeding ...`)

  // PERMISSIONS
  for (const permission of permissionData) {
    await prisma.permission.create({ data: permission})
    console.log(`Permissions ${permission.uuid}`)
  }

  for (const role of roleData) {
    await prisma.role.create({ data: role})
    console.log(`Role ${role.uuid}`)
  }

  for (const user of userData) {
    await prisma.user.create({ data: user})
    console.log(`User ${user.email} - ${user.name}`)
  }

  for (const group of groupData) {
    await prisma.group.create({ data: group})
    console.log(`Group ${group.name} - ${group.uuid}`)
  }

  for (const membership of membershipData) {
    await prisma.membership.create({ data: membership})
    console.log(`Membership ${membership.uuid}`)
  }

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
