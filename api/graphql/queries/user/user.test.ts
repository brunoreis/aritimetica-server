import { ServerInfo } from 'apollo-server'
import {
  createServerAndClient,
  closeServer,
  createAuthJwt,
} from '../../../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedUserQuery from './user.gql'
import {
  UserQuery,
  UserQueryVariables,
} from '../../../../generated/api-client-types'
import { GraphQLClient } from 'graphql-request'
import { users } from '../../../../seed-data'

const userQuery: TypedDocumentNode<UserQuery, UserQueryVariables> =
  untypedUserQuery as unknown as TypedDocumentNode<
    UserQuery,
    UserQueryVariables
  >

describe('user query', () => {
  let serverI: ServerInfo
  let clientI: GraphQLClient

  beforeAll(async () => {
    let { serverInstance, client } = await createServerAndClient()
    serverI = serverInstance
    clientI = client
  })

  afterAll(async () => {
    closeServer(serverI)
  })

  describe('authorization::permissions', () => {
    describe('view_my_user', () => {
      it('a user has access to their own user', async () => {
        const variables: UserQueryVariables = { userUuid: users.teacher.uuid }
        const headers = {
          authorization: `Bearer ${createAuthJwt(users.teacher.uuid)}`,
        }
        const result = await clientI.request(userQuery, variables, headers)
        expect(result.user.uuid).toBe(users.teacher.uuid)
      })
    })
    describe('view_users_of_my_group', () => {
      fit('a user has access to other users in their groups', async () => {
        const variables: UserQueryVariables = { userUuid: users.teacher.uuid }
        const headers = {
          authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`, // user1 querying for teacher
        }
        const result = await clientI.request(userQuery, variables, headers)
        expect(result.user.uuid).toBe(users.teacher.uuid)
      })
      it('a user cannot access the receivedLessons of other users in their group', () => {})
      it('a user with view_all_lessons_of_any_user_in_this_group permission can see the received lessons of a user in the group where they have that role', () => {})
    })
    describe('view_all_users', () => {})
  })
})
