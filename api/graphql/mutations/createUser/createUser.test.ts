import { ServerInfo } from 'apollo-server'
import {
  createClient,
  createPrismaClient,
  closePrismaClient,
  createAuthJwt,
} from '../../../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedCreateUserMutation from './createUser.gql'
import { users, membershipRoles } from '../../../../seed-data'
import {
  CreateUserMutation,
  CreateUserMutationVariables,
} from '../../../../generated/api-client-types'
import { GraphQLClient } from 'graphql-request'
import { PrismaClient } from '@prisma/client'

const createUserMutation: TypedDocumentNode<
  CreateUserMutation,
  CreateUserMutationVariables
> = untypedCreateUserMutation as unknown as TypedDocumentNode<
  CreateUserMutation,
  CreateUserMutationVariables
>

const groupName = 'Test Group'

const loadUserGroupId = async (prismaI: PrismaClient, userUuid: string) => {
  const user = await prismaI.user.findUnique({
    where: { uuid: userUuid },
    include: {
      memberships: {
        include: { group: true },
      },
    },
  })
  return user?.memberships[0].groupUuid
}

describe('createUser mutation', () => {
  let serverI: ServerInfo
  let clientI: GraphQLClient
  let prismaI: PrismaClient

  beforeAll(async () => {
    let client = await createClient()
    let { prisma } = await createPrismaClient()
    clientI = client
    prismaI = prisma
  })

  afterAll(async () => {
    closePrismaClient(prismaI)
  })

  describe(`creates a new user`, () => {
    describe(`unauthenticated`, () => {
      let result: CreateUserMutation
      let testEmail1 = 'createUserUnauthenticated@aritimetica.com.br'
      beforeAll(async () => {
        await prismaI.user.deleteMany({ where: { email: testEmail1 } })
        const variablesWithoutAddToGroupUuid: CreateUserMutationVariables = {
          name: 'Test User',
          email: testEmail1,
          password: 'xpto',
        }

        result = await clientI.request(
          createUserMutation,
          variablesWithoutAddToGroupUuid,
        )
      })

      afterAll(async () => {
        try {
          await prismaI.user.deleteMany({ where: { email: testEmail1 } })
        } catch (e) {
          console.log('after delete error')
          console.log({ e })
        }
      })

      it('return the crated user', async () => {
        expect(result?.createUser.user?.uuid).toBeTruthy()
      })

      it('do not crated a membership', async () => {
        expect(result?.createUser.user?.memberships?.length).toBe(0)
      })
    })

    describe(`group owner`, () => {
      let testEmail2 = 'createUserGroupOwner@aritimetica.com.br'
      let result: CreateUserMutation

      beforeAll(async () => {
        await prismaI.user.deleteMany({ where: { email: testEmail2 } })
        const user1GroupUuid = await loadUserGroupId(prismaI, users.user1.uuid)

        if (user1GroupUuid) {
          const variables: CreateUserMutationVariables = {
            name: 'Create User Group Owner',
            email: testEmail2,
            password: 'xpto',
            addToGroupUuid: user1GroupUuid,
          }
          result = await clientI.request(createUserMutation, variables, {
            authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`,
          })
        } else {
          fail('There is no group owned by user 1')
        }
      })

      afterAll(async () => {
        try {
          await prismaI.user.deleteMany({ where: { email: testEmail2 } })
        } catch (e) {
          console.log('after delete error')
          console.log({ e })
        }
      })

      it('can create a user for its own group', async () => {
        expect(result?.createUser.user?.uuid).toBeTruthy()
      })

      it('create one membership', async () => {
        expect(result?.createUser.user?.memberships?.length).toBe(1)
      })

      it('create the membership to the group', async () => {
        const memberships = result?.createUser.user?.memberships
        if (memberships) {
          const membership = memberships[0]
          expect(membership?.membershipRole?.uuid).toBe(
            membershipRoles.student.uuid,
          )
        }
      })
    })

    describe(`not a group owner`, () => {
      let testEmail2 = 'createUserGroupOwner@aritimetica.com.br'
      let result: CreateUserMutation

      beforeAll(async () => {
        await prismaI.user.deleteMany({ where: { email: testEmail2 } })
      })

      afterAll(async () => {
        try {
          await prismaI.user.deleteMany({ where: { email: testEmail2 } })
        } catch (e) {
          console.log('after delete error')
          console.log({ e })
        }
      })

      it('cannot create a user in a group the current user is not an onwner', async () => {
        try {
          const teacher = await prismaI.user.findUnique({
            where: { uuid: users.teacher.uuid },
            include: {
              memberships: {
                include: { group: true },
              },
            },
          })
          const teacherGroupUuid = teacher?.memberships[0].groupUuid

          if (teacherGroupUuid) {
            const variables: CreateUserMutationVariables = {
              name: 'Create User Group Owner',
              email: testEmail2,
              password: 'xpto',
              addToGroupUuid: teacherGroupUuid,
            }
            result = await clientI.request(createUserMutation, variables, {
              authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`,
            })
            fail('should not be able to create a user')
          } else {
            fail('There is no group where user 1 is a student')
          }
        } catch (e: any) {
          expect(e.message).toMatch(/Not authorized/)
        }
      })
    })
  })
})
