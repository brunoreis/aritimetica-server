import { objectType } from 'nexus'
import {Group as PrismaGroup } from '@prisma/client';
import { MembershipSource } from './Membership';

export type GroupSource = PrismaGroup & {
  memberships?: MembershipSource[] | null
} | null

export const Group = objectType({
  name: 'Group',
  sourceType: {
    module: __filename,
    export: 'GroupSource'
  },
  definition(t) {
    t.string('uuid');
    t.string('name');
    t.list.field('memberships', { type: 'Membership' })
  }
})