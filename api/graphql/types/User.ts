import { objectType } from 'nexus'
import { ContextType } from '../../ContextType';

interface UserRoot {
  uuid?: string | null
  email?: string | null
  name?: string | null
  password?: string | null
  memberships?: {}[] | null
}

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('uuid')
    t.string('email')
    t.string('name')
    t.string('password')
    t.list.field('memberships', {
      type: 'Membership',
      resolve(root: UserRoot, _args, ctx: ContextType) {
        if (root.memberships) {
          return root.memberships
        } else {
          if(root.uuid) {
            const params = {
              where: {
                userUuid: root.uuid ?? undefined // set userUuid to undefined if uuid is null or undefined
              }
            }
            return ctx.db.membership.findMany(params)
          }
        }
        return null
      },
    })
  },
})
