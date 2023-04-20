import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const permissionData: Prisma.PermissionCreateInput[] = [
  { id: 'Log In' },
  { id: 'Log Out' },
  // view groups
  { id: 'View All Groups' },
  { id: 'View My Groups' },
  // manage group users
  { id: 'Invite User to Group' },
  { id: 'Change User Group Roles' },
  // view lessons list
  { id: 'View My Lessons List' },
  { id: 'View All Lessons List' },
  // view lessons
  { id: 'View My Lessons' },
  { id: 'View Group Lesson' },
  { id: 'View All Lessons' },
  // create lessons
  { id: 'Create Lesson' },
  // assign lessons
  { id: 'Assign Lesson' },
  // answer lesson
  { id: 'Answer Assigned Lesson' },
  
]

const roleData: Prisma.RoleCreateInput[] = [
  // app roles
  {
    id: 'unauthenticated',
    title: 'Unauthenticated',
    permissions: {
      connect: { id: 'Log In' },
    },
  },
  {
    id: 'authenticated',
    title: 'Authenticated',
    permissions: {
      connect: [
        { id: 'Log Out' },
        { id: 'View My Lessons List' },
        { id: 'View My Lessons' },
        { id: 'Create Lesson' },
      ],
    },
  },
  {
    id: 'admin',
    title: 'Admin',
    permissions: {
      connect: [
        { id: 'View All Groups' },
        { id: 'View All Lessons List' },
        { id: 'View All Lessons' },
      ],
    },
  },
  // group roles
  {
    id: 'group_owner',
    title: 'Group Owner',
    permissions: {
      connect: [
        { id: 'Invite User to Group' },
        { id: 'Change User Group Roles' },
      ],
    },
  },
  {
    id: 'teacher',
    title: 'Teacher',
    permissions: {
      connect: [
        { id: 'Assign Lesson' },
        { id: 'Answer Assigned Lesson' },
      ],
    },
  },
  {
    id: 'student',
    title: 'Student',
    permissions: {
      connect: [
        { id: 'Answer Assigned Lesson' },
      ],
    },
  },
]

const userData: Prisma.UserCreateInput[] = [
  {
    id: 'admin',
    email: 'admin@example.com',
    name: 'Admin',
    bio: "Hello, I'm Admin!",
    password: '$2b$10$KBPVsOCqVBJBCEEzI2S9n.2exIlJoQUX4l6KLjk5pSy5TbZdmo6.O',
  },
  {
    id: 'unauthenticated',
    email: 'unauthenticated@example.com',
    name: 'Unauthenticated User',
    bio: "Hello, I'm Unauthenticated!",
    password: '$2b$10$KBPVsOCqVBJBCEEzI2S9n.2exIlJoQUX4l6KLjk5pSy5TbZdmo6.O',
  },
  {
    id: 'cfd7d883-93a6-4f15-b7a8-cba0ffc52363',
    email: 'teacher@example.com',
    password: '$2b$10$CqlCrFqv5KlEeg926QRAaOAft2t/dINTreuFkn1irQnQl7W.WClNq',
    name: 'Teacher',
    bio: "Hi, I'm Jane!",
  },
  {
    id: 'c1f875d9-1889-42f3-8c3b-5f5aa35d1a5f',
    email: 'user1@example.com',
    password: '$2b$10$CqlCrFqv5KlEeg926QRAaOAft2t/dINTreuFkn1irQnQl7W.WClNq',
    name: 'User 1',
    bio: "Hi, I'm John!",
  },
  {
    id: 'a918c10a-6d89-4f67-b814-14b86c9e60d2',
    email: 'user2@example.com',
    password: '$2b$10$CqlCrFqv5KlEeg926QRAaOAft2t/dINTreuFkn1irQnQl7W.WClNq',
    name: 'User 2',
    bio: "Hi, I'm Alex!",
  },
]

const groupData: Prisma.GroupCreateInput[] = [
  {
    id: 'app',
    name: 'App',
  },
  {
    id: '5c5b0bf5-5f9d-49a1-bdc5-3bbda3a847af',
    name: 'Admin Default(Owned) Group',
  },
  {
    id: 'a3d3df3e-3de3-429d-905d-2c313bea906a',
    name: 'Teacher Default(Owned) Group',
  },
  {
    id: '95d3005c-18e1-4e9e-a034-e717d262d7ce',
    name: 'User 1 Default(Owned) Group',
  },
  {
    id: '2f60f81b-6d16-4c57-93a8-fd1a87926c25',
    name: 'User 2 Default(Owned) Group',
  },
]

const membershipData: Prisma.MembershipCreateInput[] = [
  {
    id: '8c2dc6f2-1885-4473-aa5f-1e92ebebbcf5',
    user: { connect: { email: 'admin@example.com' } },
    group: { connect: { id: 'app' } },
    role: { connect: { id: 'admin' } },
  },
  {
    id: '3ed8c2d2-af04-4d87-b6f8-1a13829174ee',
    user: { connect: { email: 'unauthenticated@example.com' } },
    group: { connect: { id: 'app' } },
    role: { connect: { id: 'unauthenticated' } },
  },
  {
    id: 'f3b3f174-14b3-4690-9b9a-330914a6f47e',
    user: { connect: { email: 'admin@example.com' } },
    group: { connect: { id: '5c5b0bf5-5f9d-49a1-bdc5-3bbda3a847af' } },
    role: { connect: { id: 'group_owner' } },
  },
  {
    id: 'e4b4a41d-2d8c-4b32-a1c4-8530e7b8d4b3',
    user: { connect: { email: 'teacher@example.com' } },
    group: { connect: { id: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
    role: { connect: { id: 'group_owner' } },
  },
  {
    id: '997b3f6c-3d98-4a75-b207-63fc74c1fc57',
    user: { connect: { email: 'user1@example.com' } },
    group: { connect: { id: '95d3005c-18e1-4e9e-a034-e717d262d7ce' } },
    role: { connect: { id: 'group_owner' } },
  },
  {
    id: 'f1c583f4-8b87-4f44-a34c-4cf7f1d58ab7',
    user: { connect: { email: 'user2@example.com' } },
    group: { connect: { id: '2f60f81b-6d16-4c57-93a8-fd1a87926c25' } },
    role: { connect: { id: 'group_owner' } },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  // PERMISSIONS
  for (const p of permissionData) {
    const permission = await prisma.permission.create({
      data: p,
    })
    console.log(`Created permission with id: ${p.id}`)
  }
  // ROLES
  for (const r of roleData) {
    const role = await prisma.role.create({
      data: r,
    })
    console.log(`Created role with id: ${r.id}`)
  }
  // USERS
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  // // GROUPS
  for (const g of groupData) {
    const group = await prisma.group.create({
      data: g,
    })
    console.log(`Created group with id: ${g.id}`)
  }
  // // MEMBERSHIPS
  for (const m of membershipData) {
    const membership = await prisma.membership.create({
      data: m,
    })
    console.log(`Created membership with id: ${m.id}`)
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
