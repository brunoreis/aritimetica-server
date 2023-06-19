import { ServerInfo } from 'apollo-server'
import {
  createServerAndClient,
  closeServer,
  createPrismaClient,
  closePrismaClient,
  createAuthJwt,
} from '../../../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedCreateUserMutation from './createUser.gql'
import { users, roles, memberships } from '../../../../seed-data'
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

describe('createUser mutation', () => {
  let serverI: ServerInfo
  let clientI: GraphQLClient
  let prismaI: PrismaClient

  beforeAll(async () => {
    let { serverInstance, client } = await createServerAndClient()
    let { prisma } = await createPrismaClient()
    serverI = serverInstance
    clientI = client
    prismaI = prisma
  })

  afterAll(async () => {
    closeServer(serverI)
    closePrismaClient(prismaI)
  })

  describe(`creates a new user`, () => {
    describe(`unauthenticated`, () => {
      let result: CreateUserMutation
      let testEmail1 = 'createUserUnauthenticated@aritimetica.com.br'
      beforeAll(async () => {
        await prismaI.user.deleteMany({ where: { email: testEmail1 } })
        const variables: CreateUserMutationVariables = {
          name: 'Test User',
          email: testEmail1,
          password: 'xpto',
        }

        result = await clientI.request(createUserMutation, variables)
        //   result = await clientI.request(createUserMutation, variables, {
        //     authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`,
        //   })
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
    })

    describe(`group owner`, () => {
      let testEmail2 = 'createUserGroupOwner@aritimetica.com.br'
      let result: CreateUserMutation

      beforeAll(async () => {
        await prismaI.user.deleteMany({ where: { email: testEmail2 } })
        const user1GroupUuid = memberships.find(
          (membership) =>
            membership.role.connect.uuid === roles.group_owner.uuid &&
            membership.user.connect.uuid === users.user1.uuid,
        )?.group.connect.uuid
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
          const user1StudentGroup = memberships.find(
            (membership) =>
              membership.role.connect.uuid === roles.student.uuid &&
              membership.user.connect.uuid === users.user1.uuid,
          )
          if (user1StudentGroup) {
            const variables: CreateUserMutationVariables = {
              name: 'Create User Group Owner',
              email: testEmail2,
              password: 'xpto',
              addToGroupUuid: user1StudentGroup.uuid,
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
