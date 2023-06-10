import { ServerInfo } from 'apollo-server'
import { createServerAndClient, closeServer, createPrismaClient } from '../../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedCreateGroupMutation from './createGroup.gql'
import {
  CreateGroupMutation,
  CreateGroupMutationVariables,
} from '../../../../apiClientTypes'
import { GraphQLClient } from 'graphql-request'
import { PrismaClient } from "@prisma/client";

const createGroupMutation: TypedDocumentNode<
  CreateGroupMutation,
  CreateGroupMutationVariables
> = untypedCreateGroupMutation as unknown as TypedDocumentNode<
  CreateGroupMutation,
  CreateGroupMutationVariables
>

const groupName = "Test Group"

describe('createGroup mutation', () => {
  let serverI: ServerInfo
  let clientI: GraphQLClient
  let prismaI: PrismaClient
  
  beforeAll(async () => {
    let { serverInstance, client } = await createServerAndClient()
    let { prisma } = await createPrismaClient();
    serverI = serverInstance
    clientI = client
    prismaI = prisma
  })

  afterAll(async () => {
    closeServer(serverI)
  })

  describe(`creates the "${groupName}" group`, () => {
    let result: CreateGroupMutation

    beforeAll(async () => {
      const variables: CreateGroupMutationVariables = {
        name: groupName,
      }
      result = await clientI.request(createGroupMutation, variables)
    })

    it('return the group, with the name and a uuid', () => {
      expect(result?.createGroup.group?.name).toBe(groupName)
      expect(result?.createGroup.group?.uuid).not.toBeFalsy()
    })

    it('insert that group in the db', async () => {
      const createdGroup = result.createGroup.group;
      if(!createdGroup) {
        fail("group was not created")
      }
      const dbGroup = await prismaI.group.findUnique({ where: { 
        uuid: createdGroup.uuid
      }})
      if(!dbGroup) {
        fail("group was not inserted into the db")
      }
      expect(dbGroup.uuid).toBe(createdGroup.uuid)
      expect(dbGroup.name).toBe(createdGroup.name)
    })

    fit('creates a membership assigning the current user as the group owner', async () => {
      const createdGroup = result.createGroup.group;
      const memberships = await prismaI.membership.findMany();
      console.log(memberships)
    })
  })
})
