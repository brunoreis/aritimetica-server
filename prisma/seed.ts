import { PrismaClient } from '@prisma/client'
import { users, permissions, membershipRoles, groups } from '../seed-data'
import { createGroupForUser } from '../service'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  // PERMISSIONS
  for (const permission of Object.values(permissions)) {
    await prisma.permission.create({ data: permission })
    console.log(`Permissions ${permission.uuid}`)
  }

  for (const membershipRole of Object.values(membershipRoles)) {
    await prisma.membershipRole.create({ data: membershipRole })
    console.log(`Role ${membershipRole.uuid}`)
  }

  const { unauthenticated, ...otherUsers } = users

  await prisma.user.create({ data: unauthenticated })
  console.log(`User: ${unauthenticated.email} - ${unauthenticated.name}`)

  for (const user of Object.values(otherUsers)) {
    await prisma.user.create({
      data: {
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      },
    })
    console.log(
      `User with group_owner membership and own group: ${user.email} - ${user.name}`,
    )
  }

  await prisma.group.create({
    data: groups.app,
  })

  const memberships = [
    {
      user: { connect: { uuid: users.admin.uuid } },
      group: { connect: { uuid: 'app' } },
      membershipRole: { connect: { uuid: membershipRoles.admin.uuid } },
    },
    {
      user: { connect: { uuid: users.unauthenticated.uuid } },
      group: { connect: { uuid: 'app' } },
      membershipRole: {
        connect: { uuid: membershipRoles.unauthenticated.uuid },
      },
    },
  ]

  for (const membership of Object.values(memberships)) {
    await prisma.membership.create({ data: membership })
    console.log(`Membership`)
  }

  await createGroupForUser(prisma, users.teacher.uuid, 'default')
  await createGroupForUser(prisma, users.user1.uuid, 'default')

  const teacherUser = await prisma.user.findUnique({
    where: { uuid: users.teacher.uuid },
    include: { memberships: { include: { group: true } } },
  })

  const teacherGroupMembership = teacherUser?.memberships.find(
    (membership) =>
      membership.membershipRoleUuid === membershipRoles.group_owner.uuid,
  )

  if (!teacherGroupMembership?.group) throw 'teacher group was not created'

  const group = teacherGroupMembership.group
  await prisma.membership.createMany({
    data: [
      {
        groupUuid: group.uuid,
        userUuid: users.teacher.uuid,
        membershipRoleUuid: membershipRoles.teacher.uuid,
      },
      {
        groupUuid: group.uuid,
        userUuid: users.user1.uuid,
        membershipRoleUuid: membershipRoles.student.uuid,
      },
      {
        groupUuid: group.uuid,
        userUuid: users.user2.uuid,
        membershipRoleUuid: membershipRoles.student.uuid,
      },
    ],
  })

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
  ]

  for (const lesson of lessonData) {
    await prisma.lesson.create({ data: lesson })
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
