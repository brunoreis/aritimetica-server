import { objectType } from 'nexus';
import { ContextType } from '../../createContext/ContextType';

interface LessonRoot {
    uuid?: string | null
    title?: string | null
    assignerUuid?: string | null
    assigneeUuid?: string | null
    assigner?: {} | null
    assignee?: {} | null
    createdAt?: Date | null
    updatedAt?: Date | null
}

export const Lesson = objectType({
  name: 'Lesson',
  definition(t) {
    t.string('uuid');
    t.string('title');
    t.field('assigner', {
        type: 'User',
        resolve(root: LessonRoot, _args, ctx: ContextType) {
          if (root.assigner) {
            return root.assigner
          } else {
            if (root.assignerUuid) {
              const params = {
                where: {
                  uuid: root.assignerUuid
                }
              }
              return ctx.db.user.findUnique(params)
            }
          }
          return null
        },
      })
      t.field('assignee', {
        type: 'User',
        resolve(root: LessonRoot, _args, ctx: ContextType) {
          if (root.assignee) {
            return root.assignee
          } else {
            if (root.assigneeUuid) {
              const params = {
                where: {
                  uuid: root.assigneeUuid
                }
              }
              return ctx.db.user.findUnique(params)
            }
          }
          return null
        },
      })
    t.string('assignerUuid');
    t.string('assigneeUuid');
  },
});