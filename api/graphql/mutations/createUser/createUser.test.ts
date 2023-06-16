import { ServerInfo } from 'apollo-server'
import {
  createServerAndClient,
  closeServer,
  createPrismaClient,
  closePrismaClient,
} from '../../../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedCreateUserMutation from './createUser.gql'

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
    let result: CreateUserMutation
    let testEmail = 'testUser1Xpto@aritimetica.com.br'

    beforeAll(async () => {
      const variables: CreateUserMutationVariables = {
        name: 'Test User',
        email: testEmail,
        password: 'xpto',
      }

      result = await clientI.request(createUserMutation, variables)
      //   result = await clientI.request(createUserMutation, variables, {
      //     authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`,
      //   })
    })

    afterAll(async () => {
      try {
        await prismaI.user.delete({ where: { email: testEmail } })
      } catch (e) {
        console.log('after delete error')
        console.log({ e })
      }
    })

    it('return the crated user', async () => {
      expect(result?.createUser.user?.uuid).toBeTruthy()
    })
  })
})
