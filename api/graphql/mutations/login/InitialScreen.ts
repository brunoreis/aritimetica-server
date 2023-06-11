import type { UserSource } from '../../types/User'
import { unionType } from 'nexus'

export type InitialScreenSource = {
  user: UserSource
}

// Define union type for the two possible screen types
export const InitialScreen = unionType({
  name: 'InitialScreen',
  sourceType: {
    module: __filename,
    export: 'InitialScreenSource',
  },
  definition(t) {
    t.members('UsersScreen', 'LessonsScreen')
  },
  async resolveType(value) {
    const memberships = await value.user?.memberships
    const isTeacher =
      memberships &&
      memberships
        .map((membership) => membership?.role?.uuid)
        .includes('teacher')
    return isTeacher ? 'UsersScreen' : 'LessonsScreen'
  },
})
