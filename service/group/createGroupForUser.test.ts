import { createPrismaClient } from '../../testHelpers'
import { createGroupForUser } from './createGroupForUser'

describe('createGroupForUser', () => {
  let prisma = createPrismaClient().prisma
  const email = 'createGroupForUser1@example.com'

  it('create a group and a membership for the provided user', async () => {
    // await prisma.$transaction(async (tx) => {
    //   const m = await tx.membership.findFirstOrThrow({
    //     where: { user: { email } },
    //     include: { user: true },
    //   })
    //   await tx.membership.delete({ where: { uuid: m.uuid } })
    //   await tx.group.delete({ where: { uuid: m.groupUuid } })
    // })
    // await prisma.$transaction(async (tx) => {
    //   tx.membership.findFirst({
    //     where: { user: { email } },
    //     include: { user: true },
    //   })
    // })
    // const u = await prisma.user.create({
    //   data: {
    //     email,
    //     name: 'dude',
    //     password: 'hey joe',
    //   },
    // })
    // const membership = await createGroupForUser(
    //   prisma,
    //   u.uuid,
    //   'CreateGroupForUser test group',
    // )
    // console.log({ membership })
    //
  })
})
