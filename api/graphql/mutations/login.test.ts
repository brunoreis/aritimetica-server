import { ServerInfo } from 'apollo-server';
import { createServerAndClient, closeServer } from '../../testHelpers'
import loginMutation from './login.gql';


describe('login mutation', () => {
  let result:any = null; // @todo: type this
  let serverI: ServerInfo;
  beforeAll(async () => {
    let { serverInstance , client } = await createServerAndClient()
    serverI = serverInstance;
    const variables = {
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
    expect(result.login.jwt).toBeTruthy()
  })

  describe('given that the user has the role teacher (seed fixture)', () => {
    it("returns a UsersScreen", () => {
      expect(result.login.screen.__typename).toBe('UsersScreen')
    })

    it("return the correct user uuid, email and name", () => {
      const { uuid, email, name } = result.login.screen.user;
      expect(uuid).toBe('cfd7d883-93a6-4f15-b7a8-cba0ffc52363');
      expect(email).toBe('teacher@example.com');
      expect(name).toBe('Teacher');
    })

    it("return two user memberships", () => {
      expect(result.login.screen.user.memberships.length).toBe(2)
    })
    
    it("return the role and the teacher memberships", () => {
      const groupUuid = 'a3d3df3e-3de3-429d-905d-2c313bea906a';
      const { memberships } = result.login.screen.user
      expect(memberships.map(m=>m.role.uuid)).toEqual(['group_owner', 'teacher'])
      expect(memberships.map(m=>m.group.uuid)).toEqual([groupUuid, groupUuid])
    })
  })

})
