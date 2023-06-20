import { ServerInfo } from 'apollo-server'
import {
  createServerAndClient,
  closeServer,
  createAuthJwt,
  createPrismaClient,
  closePrismaClient,
} from '../../../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedLoginMutation from './login.gql'
import {
  LoginMutation,
  LoginMutationVariables,
} from '../../../../generated/api-client-types'
import { GraphQLClient } from 'graphql-request'
import { PrismaClient } from '@prisma/client'
import { users } from '../../../../seed-data'

const loginMutation: TypedDocumentNode<LoginMutation, LoginMutationVariables> =
  untypedLoginMutation as unknown as TypedDocumentNode<
    LoginMutation,
    LoginMutationVariables
  >

describe('login mutation', () => {
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

  describe('a logged in user cannot login again', () => {
    it('try to login a logged in user', async () => {
      const variables: LoginMutationVariables = {
        email: 'teacher@example.com',
        password: 'secretPassword123',
      }
      try {
        await clientI.request(loginMutation, variables, {
          authorization: `Bearer ${createAuthJwt(users.user1.uuid)}`,
        })
        expect(false).toBe('should not allow a logged user to log in again')
      } catch (e: any) {
        expect(e.message).toMatch(/Not authorized/)
      }
    })
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
          expect(uuid).toBe(users.user1.uuid)
          expect(email).toBe(users.user1.email)
          expect(name).toBe(users.user1.name)
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
          expect(uuid).toBe(users.teacher.uuid)
          expect(email).toBe(users.teacher.email)
          expect(name).toBe(users.teacher.name)
        })

        it('return user memberships', () => {
          let numMemberships = 0
          if (result?.login.screen?.__typename == 'UsersScreen') {
            numMemberships =
              result?.login.screen?.user?.memberships?.length || 0
          }
          expect(numMemberships).toBe(2)
        })

        it('return the role and the teacher memberships', async () => {
          const teacherUser = await prismaI.user.findUnique({
            where: { uuid: users.teacher.uuid },
            include: {
              memberships: {
                include: { group: true },
              },
            },
          })
          const groupUuid = teacherUser?.memberships[0].groupUuid
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
