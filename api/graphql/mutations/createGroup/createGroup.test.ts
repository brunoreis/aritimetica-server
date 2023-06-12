import { ServerInfo } from 'apollo-server'
import {
  createServerAndClient,
  closeServer,
  createPrismaClient,
  closePrismaClient,
  createAuthJwt,
} from '../../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedCreateGroupMutation from './createGroup.gql'
import { users } from '../../../../seed-data'

import {
  CreateGroupMutation,
  CreateGroupMutationVariables,
} from '../../../../generated/api-client-types'
import { GraphQLClient } from 'graphql-request'
import { PrismaClient } from '@prisma/client'

const createGroupMutation: TypedDocumentNode<
  CreateGroupMutation,
  CreateGroupMutationVariables
> = untypedCreateGroupMutation as unknown as TypedDocumentNode<
  CreateGroupMutation,
  CreateGroupMutationVariables
>

const groupName = 'Test Group'

describe('createGroup mutation', () => {
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

  describe(`creates the "${groupName}" group`, () => {
    let result: CreateGroupMutation

    beforeAll(async () => {
      const variables: CreateGroupMutationVariables = {
        name: groupName,
      }

      result = await clientI.request(createGroupMutation, variables, {
        authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`,
      })
    })

    it('return the group, with the name and a uuid', () => {
      expect(result?.createGroup.group?.name).toBe(groupName)
      expect(result?.createGroup.group?.uuid).not.toBeFalsy()
    })

    it('insert that group in the db', async () => {
      const createdGroup = result.createGroup.group
      if (createdGroup && createdGroup.uuid) {
        const dbGroup = await prismaI.group.findUnique({
          where: {
            uuid: createdGroup.uuid,
          },
        })
        if (!dbGroup) {
          fail('group was not inserted into the db')
        }
        expect(dbGroup.uuid).toBe(createdGroup.uuid)
        expect(dbGroup.name).toBe(createdGroup.name)
      } else {
        fail('group was not created')
      }
    })

    it('creates a membership assigning the current user as the group owner', async () => {
      const createdGroup = result.createGroup.group
      if (createdGroup && createdGroup.uuid) {
        const memberships = await prismaI.membership.findMany({
          where: {
            groupUuid: createdGroup.uuid,
          },
        })
        expect(memberships[0].uuid).toBeTruthy()
        expect(memberships[0].roleUuid).toBe('group_owner')
        expect(memberships[0].userUuid).toBe(users.user1.uuid)
      } else {
        fail('group was not created')
      }
    })
  })
})
