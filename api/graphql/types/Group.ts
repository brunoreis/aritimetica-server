import { objectType } from 'nexus'

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.string('uuid')
    t.string('name')
  },
})