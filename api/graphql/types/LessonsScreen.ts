import { objectType } from 'nexus'
import type { UserSource } from './User'

export type LessonsScreenSource = {
  user: UserSource
}

export const LessonsScreen = objectType({
  name: 'LessonsScreen',
  sourceType: {
    module: __filename,
    export: 'LessonsScreenSource'
  },
  definition(t) {
    t.field('user', { type: 'User' })
  },
})
