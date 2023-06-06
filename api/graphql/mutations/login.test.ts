import { ServerInfo } from 'apollo-server';
import { createServerAndClient, closeServer } from '../../testHelpers'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import untypedLoginMutation from './login.gql';
import { LoginMutation, LoginMutationVariables } from '../../../apiClientTypes'

const loginMutation: TypedDocumentNode<LoginMutation,LoginMutationVariables> = untypedLoginMutation as unknown as TypedDocumentNode<LoginMutation,LoginMutationVariables>;

describe('login mutation', () => {
  let result:LoginMutation; 
  let serverI: ServerInfo;
  beforeAll(async () => {
    let { serverInstance , client } = await createServerAndClient()
    serverI = serverInstance;
    const variables:LoginMutationVariables = {
      "email": "teacher@example.com",
      "password": "secretPassword123"
    }
    
    result = await client.request( loginMutation, variables )
  })
  afterAll(
    async () => {
      closeServer(serverI)
    }
  )

  it("returns a jwt token", () => {
    expect(result?.login.jwt).toBeTruthy()
  })

  describe('given that the user has the role teacher (seed fixture)', () => {
    it("returns a UsersScreen", () => {
      expect(result?.login.screen?.__typename).toBe('UsersScreen')
    })

    it("return the correct user uuid, email and name", () => {
      const { uuid, email, name } = result?.login.screen?.user || {};
      expect(uuid).toBe('cfd7d883-93a6-4f15-b7a8-cba0ffc52363');
      expect(email).toBe('teacher@example.com');
      expect(name).toBe('Teacher');
    })

    it("return two user memberships", () => {
      let numMemberships = 0;
      if(result?.login.screen?.__typename == 'UsersScreen') {
        numMemberships = result?.login.screen?.user?.memberships?.length || 0
      }
      expect(numMemberships).toBe(2)
    })
    
    it("return the role and the teacher memberships", () => {
      const groupUuid = 'a3d3df3e-3de3-429d-905d-2c313bea906a';
      if(result?.login.screen?.__typename == 'UsersScreen') {
        const memberships = result?.login.screen?.user?.memberships
        if(memberships) {
          expect(memberships.map(m=>m?.role?.uuid)).toEqual(['group_owner', 'teacher'])
          expect(memberships.map(m=>m?.group?.uuid)).toEqual([groupUuid, groupUuid])
        }
      } else {
        fail()
      }
    })
  })
})
