import { ServerInfo } from 'apollo-server'
import {
  createServerAndClient,
  closeServer,
  createAuthJwt,
} from '../../../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedUserQuery from './user.gql'
import untypedUserWithReceivedLessonsQuery from './userWithReceivedLessons.gql'
import {
  UserQuery,
  UserQueryVariables,
  UserWithReceivedLessonsQuery,
  UserWithReceivedLessonsQueryVariables,
} from '../../../../generated/api-client-types'
import { GraphQLClient } from 'graphql-request'
import { users } from '../../../../seed-data'

const userQuery: TypedDocumentNode<UserQuery, UserQueryVariables> =
  untypedUserQuery as unknown as TypedDocumentNode<
    UserQuery,
    UserQueryVariables
  >

const userWithReceivedLessonsQuery: TypedDocumentNode<
  UserWithReceivedLessonsQuery,
  UserWithReceivedLessonsQueryVariables
> = untypedUserWithReceivedLessonsQuery as unknown as TypedDocumentNode<
  UserWithReceivedLessonsQuery,
  UserWithReceivedLessonsQueryVariables
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
    describe('users', () => {
      describe('view_all_users', () => {
        it('a user with view_all_users permission has access to other users in their groups', async () => {
          const variables: UserQueryVariables = { userUuid: users.user1.uuid }
          const headers = {
            authorization: `Bearer ${createAuthJwt(users.admin.uuid)}`, // user1 querying for teacher
          }
          const result = await clientI.request(userQuery, variables, headers)
          expect(result.user.uuid).toBe(users.user1.uuid)
        })
      })
      describe('view_users_of_my_group', () => {
        it('a user has access to other users in their groups', async () => {
          const variables: UserQueryVariables = { userUuid: users.teacher.uuid }
          const headers = {
            authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`, // user1 querying for teacher
          }
          const result = await clientI.request(userQuery, variables, headers)
          expect(result.user.uuid).toBe(users.teacher.uuid)
        })
      })
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
    })
    describe('lessons', () => {
      describe('view_all_lessons', () => {
        it('a user with view_all_lessons can also see the recieved lessons', async () => {
          const variables: UserQueryVariables = { userUuid: users.user1.uuid }
          const headers = {
            authorization: `Bearer ${createAuthJwt(users.admin.uuid)}`,
          }
          const result = await clientI.request(
            userWithReceivedLessonsQuery,
            variables,
            headers,
          )
          expect(result.user.uuid).toBe(users.user1.uuid)
        })
      })
      describe('view_all_lessons_of_any_user_in_this_group', () => {
        it('a user cannot access the receivedLessons of other users in their group (unless they have the permission to do it)', async () => {
          const variables: UserQueryVariables = { userUuid: users.teacher.uuid }
          const headers = {
            authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`, // user1 querying for teacher
          }
          try {
            const result = await clientI.request(
              userWithReceivedLessonsQuery,
              variables,
              headers,
            )
            expect(false).toBe(
              'should not allow a user to access received lessons of other users',
            )
          } catch (e: any) {
            expect(e.message).toMatch(/Not authorized/)
          }
        })

        it('a user with view_all_lessons_of_any_user_in_this_group permission can see the received lessons of a user in the group where they have that membershipRole', async () => {
          const variables: UserQueryVariables = { userUuid: users.user1.uuid }
          const headers = {
            authorization: `Bearer ${createAuthJwt(users.teacher.uuid)}`,
          }
          const result = await clientI.request(
            userWithReceivedLessonsQuery,
            variables,
            headers,
          )
          expect(result.user.uuid).toBe(users.user1.uuid)
        })
      })
      describe('view_my_received_lessons', () => {
        it('a user can see their own received lessons', async () => {
          const variables: UserQueryVariables = { userUuid: users.user1.uuid }
          const headers = {
            authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`,
          }
          const result = await clientI.request(
            userWithReceivedLessonsQuery,
            variables,
            headers,
          )
          expect(result.user.uuid).toBe(users.user1.uuid)
        })
      })
    })
  })
})
