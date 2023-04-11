import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: "admin@example.com",
    id: "34075a0d-0431-424b-add0-7c893c6fe0b5",
    name: "Admin",
    bio: "Hello, I'm Admin!",
    role: "admin",
    password: "$2b$10$KBPVsOCqVBJBCEEzI2S9n.2exIlJoQUX4l6KLjk5pSy5TbZdmo6.O",
  },
  {
    email: "teacher@example.com",
    id: "cfd7d883-93a6-4f15-b7a8-cba0ffc52363",
    password: "$2b$10$CqlCrFqv5KlEeg926QRAaOAft2t/dINTreuFkn1irQnQl7W.WClNq",
    name: "Teacher",
    bio: "Hi, I'm Jane!",
    role: "teacher",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
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
