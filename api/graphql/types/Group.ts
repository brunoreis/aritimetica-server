import { objectType } from 'nexus'
import {Group as PrismaGroup } from '@prisma/client';

export type GroupSource = PrismaGroup 

export const Group = objectType({
  name: 'Group',
  sourceType: {
    module: __filename,
    export: 'GroupSource'
  },
  definition(t) {
    t.string('uuid')
    t.string('name')
  },
})