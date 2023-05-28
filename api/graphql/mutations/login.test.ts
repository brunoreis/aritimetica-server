import { ServerInfo } from 'apollo-server';
import { createServerAndClient, closeServer, createPrismaClient } from '../../testHelpers'


const mutation = `            
  mutation LoginTeacher($email: String!, $password: String!) {
      login(email: $email, password: $password) {
      jwt
      screen {
          __typename
          ... on UsersScreen {
          user {
              uuid
              email
              name
              memberships {
                role {
                    uuid
                    title
                }
                group {
                    uuid
                    name
                }
              }
          }
          }
          ... on LessonsScreen {
          user {
              uuid
              email
              name
              receivedLessons {
              uuid
              title
              }
          }
          }
      }
      }
  }  
`

describe('login mutation', () => {
  let result:any = null; // @todo: type this
  let serverI: ServerInfo;
  beforeAll(async () => {
    let { serverInstance , client } = await createServerAndClient()
    serverI = serverInstance;
    result = await client.request(mutation, {
      "email": "teacher@example.com",
      "password": "secretPassword123"
    })
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
    
    it.todo("return the correct user memberships")
    // , () => {
    //   console.log(result.login.screen.user.memberships)
    // })
  })

})
