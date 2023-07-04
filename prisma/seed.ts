import { PrismaClient } from '@prisma/client'
import { users, permissions, membershipRoles, groups } from '../seed-data'
import { createGroupForUser } from '../service'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log(`Adding triggers`)
  await prisma.$executeRaw`
    CREATE FUNCTION avoid_group_without_owner() 
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL
    AS $$
    DECLARE 
      owners_count INTEGER;
      members_count INTEGER;
    BEGIN
      IF OLD."membershipRoleUuid" = 'group_owner' THEN
        SELECT count(uuid)
        INTO owners_count
        FROM "Membership"
        WHERE "groupUuid" = OLD."groupUuid"
          AND "membershipRoleUuid" = 'group_owner';

        SELECT count(uuid)
        INTO members_count
        FROM "Membership"
        WHERE "groupUuid" = OLD."groupUuid";

        raise info 'owners_count: %', owners_count;
        raise info 'members_count: %', members_count;

        IF members_count = 0 THEN
          DELETE FROM "Group" WHERE uuid = OLD."groupUuid";
        ELSIF owners_count < 1 THEN
          RAISE EXCEPTION 'This change would leave the following group, that has other memberships, without an owner: %. If you remove all the other memberships and repeat the operation, the group will be deleted.', OLD."groupUuid";
        END IF;
      END IF;

      RETURN OLD; 
    END;
    $$;`

  await prisma.$executeRaw`
    CREATE TRIGGER avoid_group_without_owner_trigger
        AFTER DELETE OR UPDATE 
        ON public."Membership"
        FOR EACH ROW
        EXECUTE FUNCTION public.avoid_group_without_owner();`

  await prisma.$executeRaw`
    CREATE or REPLACE FUNCTION create_owner_membership_for_group() 
      RETURNS TRIGGER 
      LANGUAGE PLPGSQL
    AS $$
      BEGIN
      INSERT INTO public."Membership" ("uuid", "userUuid", "membershipRoleUuid", "groupUuid") VALUES (gen_random_uuid(), current_setting('aritimetica.group_owner_userUuid'), 'group_owner', NEW."uuid");
      RETURN NEW;
      END;
    $$;`

  await prisma.$executeRaw`
    CREATE TRIGGER create_owner_membership_for_group_trigger
    AFTER INSERT
    ON public."Group"
    FOR EACH ROW
    EXECUTE FUNCTION public.create_owner_membership_for_group();`

  // PERMISSIONS
  for (const permission of Object.values(permissions)) {
    await prisma.permission.create({ data: permission })
    console.log(`Permissions ${permission.uuid}`)
  }

  //USERS - UNAUTHENTICATED
  const { unauthenticated, ...otherUsers } = users

  await prisma.user.create({ data: unauthenticated })
  console.log(`User: ${unauthenticated.email} - ${unauthenticated.name}`)

  console.log('>>> USERS - OTHER')
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

  console.log('>>> MEMBERSHIP ROLES')

  for (const membershipRole of Object.values(membershipRoles)) {
    console.log(`Create Role ${membershipRole.uuid}:`)
    await prisma.membershipRole.create({ data: membershipRole })
  }

  console.log('>>> APP GROUPS')

  await createGroupForUser(
    prisma,
    users.admin.uuid,
    groups.app.name,
    groups.app.uuid,
  )

  const memberships = [
    {
      user: { connect: { uuid: users.admin.uuid } },
      group: { connect: { uuid: 'app' } },
      membershipRole: { connect: { uuid: membershipRoles.authenticated.uuid } },
    },
    {
      user: { connect: { uuid: users.unauthenticated.uuid } },
      group: { connect: { uuid: 'app' } },
      membershipRole: {
        connect: { uuid: membershipRoles.unauthenticated.uuid },
      },
    },
  ]

  console.log('>>> AUTHENTICATED AND UNAUTHENTICATED MEMBERSHIP ROLES')
  for (const membership of Object.values(memberships)) {
    console.log(
      `Create Membership... ${membership.membershipRole.connect.uuid}`,
    )
    await prisma.membership.create({ data: membership })
  }

  console.log('>>> CREATE OWNED GROUPS')
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

  console.log('>>> TEACHER AND STUDENT MEMBERSHIPS')
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

  console.log('LESSON')
  for (const lesson of lessonData) {
    console.log(`Lesson ${lesson.uuid}`)
    await prisma.lesson.create({ data: lesson })
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
