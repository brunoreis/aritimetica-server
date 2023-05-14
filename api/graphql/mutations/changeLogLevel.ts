import { extendType, enumType } from 'nexus'
import pino from 'pino';

const Level = enumType({
  name: 'Level',
  members: Object.keys(pino.levels.values),
})

export const PostMutation = extendType({
    type: 'Mutation',
    definition(t) {
      t.nonNull.field('changeLogLevel', {
        type: 'Boolean',
        args: {                                        
            level: Level
        },
        resolve(_root, args, ctx) {
          ctx.logger.level = args.level;
          return true
        },
      })
    },
  })

