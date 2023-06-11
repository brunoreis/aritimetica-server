import { ServerInfo } from 'apollo-server'
import { createServerAndClient, closeServer } from '../../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedLoginMutation from './login.gql'
import {
  LoginMutation,
  LoginMutationVariables,
} from '../../../../apiClientTypes'
import { GraphQLClient } from 'graphql-request'

const loginMutation: TypedDocumentNode<LoginMutation, LoginMutationVariables> =
  untypedLoginMutation as unknown as TypedDocumentNode<
    LoginMutation,
    LoginMutationVariables
  >

describe('login mutation', () => {
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

  describe('failed login', () => {
    let result: LoginMutation

    beforeAll(async () => {
      const variables: LoginMutationVariables = {
        email: 'failedLogin@example.com',
        password: 'secretPassword123',
      }
      result = await clientI.request(loginMutation, variables)
    })
    it('return error for invalid email or password', () => {
      expect(result?.login.errorMessage).toBe('Invalid Email or password')
    })
    it('does not return the jwt token', () => {
      expect(result?.login.jwt).toBe(null)
    })
  })

  describe('successful login', () => {
    let result: LoginMutation

    beforeAll(async () => {
      const variables: LoginMutationVariables = {
        email: 'teacher@example.com',
        password: 'secretPassword123',
      }
      result = await clientI.request(loginMutation, variables)
    })

    it('returns a jwt token', () => {
      expect(result?.login.jwt).toBeTruthy()
    })

    describe('returns different screens accordigly to the roles of the user being logged in', () => {
      describe('if the user does not have the role teacher', () => {
        let res: LoginMutation
        beforeAll(async () => {
          const variables: LoginMutationVariables = {
            email: 'user1@example.com',
            password: 'secretPassword123',
          }
          res = await clientI.request(loginMutation, variables)
        })
        afterAll(async () => {
          closeServer(serverI)
        })
        it('returns a LessonsScreen', () => {
          expect(res?.login.screen?.__typename).toBe('LessonsScreen')
        })
        it('return the correct user uuid, email and name', () => {
          const { uuid, email, name } = res?.login.screen?.user || {}
          expect(uuid).toBe('c1f875d9-1889-42f3-8c3b-5f5aa35d1a5f')
          expect(email).toBe('user1@example.com')
          expect(name).toBe('User 1')
        })
        it('returns the received lessons', () => {
          if (res?.login.screen?.__typename == 'LessonsScreen') {
            const user = res.login.screen?.user
            if (user && 'receivedLessons' in user) {
              expect(
                user.receivedLessons?.map((lesson) => lesson?.title),
              ).toEqual(['Lesson 1', 'Lesson 2', 'Lesson 3'])
            }
          }
        })
      })
      describe('if the user has the role teacher (seed fixture)', () => {
        it('returns a UsersScreen', () => {
          expect(result?.login.screen?.__typename).toBe('UsersScreen')
        })

        it('return the correct user uuid, email and name', () => {
          const { uuid, email, name } = result?.login.screen?.user || {}
          expect(uuid).toBe('cfd7d883-93a6-4f15-b7a8-cba0ffc52363')
          expect(email).toBe('teacher@example.com')
          expect(name).toBe('Teacher')
        })

        it('return two user memberships', () => {
          let numMemberships = 0
          if (result?.login.screen?.__typename == 'UsersScreen') {
            numMemberships =
              result?.login.screen?.user?.memberships?.length || 0
          }
          expect(numMemberships).toBe(2)
        })

        it('return the role and the teacher memberships', () => {
          const groupUuid = 'a3d3df3e-3de3-429d-905d-2c313bea906a'
          if (result?.login.screen?.__typename == 'UsersScreen') {
            const memberships = result?.login.screen?.user?.memberships
            if (memberships) {
              expect(memberships.map((m) => m?.role?.uuid)).toEqual([
                'group_owner',
                'teacher',
              ])
              expect(memberships.map((m) => m?.group?.uuid)).toEqual([
                groupUuid,
                groupUuid,
              ])
            }
          } else {
            fail()
          }
        })
      })
    })
  })
})
