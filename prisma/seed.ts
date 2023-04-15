import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const permissionData: Prisma.PermissionCreateInput[] = [
  { id: 'Log In' },
  { id: 'Log Out' },
  { id: 'View Lesson List' },
  { id: 'View Lesson' },
]

const roleData: Prisma.RoleCreateInput[] = [
  {id: 'anonymous', permissions:{
    connect: { id: 'Log In'}
  }},
  {id: 'admin', permissions:{
    connect: [
      { id: 'View Lesson List'}, 
      { id: 'View Lesson'},
      { id: 'Log Out'}
    ]
  }},
  {id: 'teacher', permissions:{
    connect: [
      { id: 'View Lesson List'}, 
      { id: 'View Lesson'},
      { id: 'Log Out'}
    ]
  }},
  {id: 'student', permissions:{
    connect: [
      { id: 'View Lesson List'}, 
      { id: 'View Lesson'},
      { id: 'Log Out'}
    ]
  }},
]

const groupData: Prisma.GroupCreateInput[] = [
  {
    id: 'group_a',
    name: 'Group A',
  },
  {
    id: 'group_b',
    name: 'Group B',
  },
];


const userData: Prisma.UserCreateInput[] = [
  {
    id: "34075a0d-0431-424b-add0-7c893c6fe0b5",
    email: "admin@example.com",
    name: "Admin",
    bio: "Hello, I'm Admin!",
    password: "$2b$10$KBPVsOCqVBJBCEEzI2S9n.2exIlJoQUX4l6KLjk5pSy5TbZdmo6.O",
  },
  {
    id: "cfd7d883-93a6-4f15-b7a8-cba0ffc52363",
    email: "teacher@example.com",
    password: "$2b$10$CqlCrFqv5KlEeg926QRAaOAft2t/dINTreuFkn1irQnQl7W.WClNq",
    name: "Teacher",
    bio: "Hi, I'm Jane!",
  },
  {
    id: "c1f875d9-1889-42f3-8c3b-5f5aa35d1a5f",
    email: "student1@example.com",
    password: "$2b$10$CqlCrFqv5KlEeg926QRAaOAft2t/dINTreuFkn1irQnQl7W.WClNq",
    name: "Student 1",
    bio: "Hi, I'm John!",
  },
  {
    id: "a918c10a-6d89-4f67-b814-14b86c9e60d2",
    email: "student2@example.com",
    password: "$2b$10$CqlCrFqv5KlEeg926QRAaOAft2t/dINTreuFkn1irQnQl7W.WClNq",
    name: "Student 2",
    bio: "Hi, I'm Alex!",
  },
];


const membershipData: Prisma.MembershipCreateInput[] = [
  {
    id: "8c2dc6f2-1885-4473-aa5f-1e92ebebbcf5",
    user: { connect: { email: "admin@example.com" } },
    group: { connect: { id: "group_a" } },
    role: { connect: { id: "admin" } },
  },
  {
    id: "c18fdaab-86e6-4de6-ba51-62e96cf9451b",
    user: { connect: { email: "teacher@example.com" } },
    group: { connect: { id: "group_a" } },
    role: { connect: { id: "teacher" } },
  },
  {
    id: "a94e518a-1a80-4c6e-9bdf-0868b1bb6e39",
    user: { connect: { email: "teacher@example.com" } },
    group: { connect: { id: "group_b" } },
    role: { connect: { id: "teacher" } },
  },
  {
    id: "3e89c406-6955-491a-82ee-10b5f5428e17",
    user: { connect: { email: "student1@example.com" } },
    group: { connect: { id: "group_b" } },
    role: { connect: { id: "student" } },
  },
  {
    id: "b5759dfe-68de-4be9-b34d-ff2f67d3e82b",
    user: { connect: { email: "student2@example.com" } },
    group: { connect: { id: "group_b" } },
    role: { connect: { id: "student" } },
  },
];


async function main() {
  console.log(`Start seeding ...`);
  // PERMISSIONS
  for (const p of permissionData) {
    const permission = await prisma.permission.create({
      data: p,
    });
    console.log(`Created permission with id: ${p.id}`);
  }
  // ROLES
  for (const r of roleData) {
    const role = await prisma.role.create({
      data: r,
    });
    console.log(`Created role with id: ${r.id}`);
  }
  // GROUPS
  for (const g of groupData) {
    const group = await prisma.group.create({
      data: g,
    });
    console.log(`Created group with id: ${g.id}`);
  }
  // USERS
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  // MEMBERSHIPS
  for (const m of membershipData) {
    const membership = await prisma.membership.create({
      data: m,
    });
    console.log(`Created membership with id: ${m.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
