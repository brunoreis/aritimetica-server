import { objectType } from 'nexus'

export const CreateUserResponse = objectType({
  name: 'CreateUserResponse',
  definition(t) {
    t.string('errorMessage')
    t.field('user', { type: 'User' })
  },
})
