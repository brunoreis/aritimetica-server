import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';

interface UserRoot {
  uuid?: string | null
  email?: string | null
  name?: string | null
  password?: string | null
  memberships?: {}[] | null
  assignedLessons?: {}[] | null
  receivedLessons?: {}[] | null
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
    t.list.field('assignedLessons', {
      type: 'Lesson',
      resolve(root: UserRoot, _args, ctx: ContextType) {
        if (root.assignedLessons) {
          return root.assignedLessons
        } else {
          if (root.uuid) {
            const params = {
              where: {
                assignerUuid: root.uuid ?? undefined
              }
            }
            return ctx.db.lesson.findMany(params)
          }
        }
        return null
      },
    })
    t.list.field('receivedLessons', {
      type: 'Lesson',
      authorize: async (root, args, ctx:ContextType) => {
        const requestedUserUuid = root.uuid;
        if(requestedUserUuid) {
          return await ctx.auth.hasGlobalPermission('View All Lessons') || 
          await ctx.auth.hasGlobalPermission('View My Received Lessons') && await ctx.auth.isCurrentUser(requestedUserUuid) || 
          (await ctx.auth.hasGroupPermissionInAGroupWithThisUser('View All Lessons Of Any User In This Group', requestedUserUuid))
        }
        return false;
      },
      resolve(root: UserRoot, _args, ctx: ContextType) {
        if (root.receivedLessons) {
          return root.receivedLessons
        } else {
          if (root.uuid) {
            const params = {
              where: {
                assigneeUuid: root.uuid ?? undefined
              }
            }
            return ctx.db.lesson.findMany(params)
          }
        }
        return null
      },
    })
  },
})
