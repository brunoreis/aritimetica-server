import { objectType } from 'nexus'

export const LessonsScreen = objectType({
  name: 'LessonsScreen',
  definition(t) {
    t.field('user', { type: 'User' })
  },
})
