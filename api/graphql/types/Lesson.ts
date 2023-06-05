import { objectType } from 'nexus';
import { ContextType } from '../../createContext/ContextType';
import Prisma, { Lesson as PrismaLesson } from '@prisma/client';
import type { UserSource } from './User';

export type LessonSource = PrismaLesson & {
  assigner?: Prisma.PrismaPromise<UserSource> | null
  assignee?: Prisma.PrismaPromise<UserSource> | null
} | null

export const Lesson = objectType({
  name: 'Lesson', 
  sourceType: {
    module: __filename,
    export: 'LessonSource'
  },
  definition(t) {
    t.string('uuid');
    t.string('title');
    t.field('assigner', {
        type: 'User',
        async resolve(root, _args, ctx: ContextType) {
          if (root?.assigner) {
            return root.assigner
          } else {
            if (root?.assignerUuid) {
              const params = {
                where: {
                  uuid: root.assignerUuid
                }
              }
              return ctx.prisma.user.findUnique(params)
            }
          }
          return null
        },
      })
      t.field('assignee', {
        type: 'User',
        resolve(root, _args, ctx: ContextType) {
          if (root?.assignee) {
            return root.assignee
          } else {
            if (root?.assigneeUuid) {
              const params = {
                where: {
                  uuid: root.assigneeUuid
                }
              }
              return ctx.prisma.user.findUnique(params)
            }
          }
          return null
        },
      })
    t.string('assignerUuid');
    t.string('assigneeUuid');
  },
});