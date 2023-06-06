import { objectType } from 'nexus'
import { ContextType } from '../../createContext/ContextType';
import { User as PrismaUser } from '@prisma/client'
import type { MembershipSource } from './Membership'
import type { LessonSource } from './Lesson'

export type UserSource = PrismaUser & {
  memberships?: MembershipSource[] | null
  assignedLessons?: LessonSource[] | null
  receivedLessons?: LessonSource[] | null
} | null

export const User = objectType({
  name: 'User',
  sourceType: {
    module: __filename,
    export: 'UserSource'
  },
  definition(t) {
    t.string('uuid')
    t.string('email')
    t.string('name')
    t.string('password')
    t.list.field('memberships', {
      type: 'Membership',
      resolve(root, _args, ctx: ContextType) {
        if (root?.memberships) {
          return root.memberships
        } else {
          if(root?.uuid) {
            const params = {
              where: {
                userUuid: root.uuid ?? undefined // set userUuid to undefined if uuid is null or undefined
              }
            }
            return ctx.prisma.membership.findMany(params)
          }
        }
        return null
      },
    })
    t.list.field('assignedLessons', {
      type: 'Lesson',
      resolve(root, _args, ctx: ContextType) {
        
        if (root?.assignedLessons) {
          return root.assignedLessons
        } else {
          if (root?.uuid) {
            const params = {
              where: {
                assignerUuid: root.uuid
              }
            }
            return ctx.prisma.lesson.findMany(params)
          }
        }
        return null
      },
    })
    t.list.field('receivedLessons', {
      type: 'Lesson',
      authorize: async (root, _args, ctx:ContextType) => {
        try {
          const requestedUserUuid = root?.uuid;
          let isAuthorized = false;
          if(requestedUserUuid) {
            isAuthorized = await ctx.auth.hasGlobalPermission('View All Lessons') || 
            await ctx.auth.hasGlobalPermission('View My Received Lessons') && await ctx.auth.isCurrentUser(requestedUserUuid) || 
            (await ctx.auth.hasGroupPermissionInAGroupWithThisUser('View All Lessons Of Any User In This Group', requestedUserUuid))
          }
          return isAuthorized
        } catch(e) {
          ctx.logger.error(e, 'User:receivedLessons:authorize - Unexpected Error')
          throw e
        }
      },
      resolve(root, _args, ctx: ContextType) {
        if (root?.receivedLessons) {
          return root.receivedLessons
        } else {
          if (root?.uuid) {
            const params = {
              where: {
                assigneeUuid: root.uuid
              }
            }
            return ctx.prisma.lesson.findMany(params)
          }
        }
        return null
      },
    })
  },
})
