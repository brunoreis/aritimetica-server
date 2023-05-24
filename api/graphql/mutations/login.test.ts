import { createTestContext } from '../../testHelpers'
const ctx = createTestContext()
it('ensures that a draft can be created and published', async () => {
  
  const result = await ctx.client.request(`            
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
  `, {
    "email": "teacher@example.com",
    "password": "secretPassword123"
    })
  console.log(result)
//   // Snapshot that draft and expect `published` to be false
//   expect(draftResult).toMatchInlineSnapshot()              // 3
//   // Publish the previously created draft
//   const publishResult = await ctx.client.request(`
//     mutation publishDraft($draftId: Int!) {
//       publish(draftId: $draftId) {
//         id
//         title
//         body
//         published
//       }
//     }
//   `,
//     { draftId: draftResult.createDraft.id }
//   )
//   // Snapshot the published draft and expect `published` to be true
//   expect(publishResult).toMatchInlineSnapshot()
},10000)