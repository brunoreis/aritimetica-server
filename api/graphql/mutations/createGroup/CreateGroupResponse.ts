import { objectType } from 'nexus'

export const CreateGroupResponse = objectType({
  name: 'CreateGroupResponse',
  definition(t) {
    t.string('errorMessage')
    t.field('group', { type: 'Group' })
  },
})
