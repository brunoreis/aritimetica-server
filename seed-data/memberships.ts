import { users } from './users'
import { roles } from './roles'

export const memberships = [
  {
    uuid: '8c2dc6f2-1885-4473-aa5f-1e92ebebbcf5',
    user: { connect: { uuid: users.admin.uuid } },
    group: { connect: { uuid: 'app' } },
    role: { connect: { uuid: roles.admin.uuid } },
  },
  {
    uuid: '3ed8c2d2-af04-4d87-b6f8-1a13829174ee',
    user: { connect: { uuid: users.unauthenticated.uuid } },
    group: { connect: { uuid: 'app' } },
    role: { connect: { uuid: roles.unauthenticated.uuid } },
  },
  {
    uuid: 'f3b3f174-14b3-4690-9b9a-330914a6f47e',
    user: { connect: { uuid: users.admin.uuid } },
    group: { connect: { uuid: '5c5b0bf5-5f9d-49a1-bdc5-3bbda3a847af' } },
    role: { connect: { uuid: roles.group_owner.uuid } },
  },
  {
    uuid: 'e4b4a41d-2d8c-4b32-a1c4-8530e7b8d4b3',
    user: { connect: { uuid: users.teacher.uuid } },
    group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
    role: { connect: { uuid: roles.group_owner.uuid } },
  },
  {
    uuid: 'e31edaf0-f59e-4a6a-9f79-1ee60dd92f38',
    user: { connect: { uuid: users.teacher.uuid } },
    group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
    role: { connect: { uuid: roles.teacher.uuid } },
  },
  {
    uuid: '997b3f6c-3d98-4a75-b207-63fc74c1fc57',
    user: { connect: { uuid: users.user1.uuid } },
    group: { connect: { uuid: '95d3005c-18e1-4e9e-a034-e717d262d7ce' } },
    role: { connect: { uuid: roles.group_owner.uuid } },
  },
  {
    uuid: '99f5d438-5b8a-4135-85d5-5e5a604f2e5a',
    user: { connect: { uuid: users.user1.uuid } },
    group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
    role: { connect: { uuid: roles.student.uuid } },
  },
  {
    uuid: 'f1c583f4-8b87-4f44-a34c-4cf7f1d58ab7',
    user: { connect: { uuid: users.user2.uuid } },
    group: { connect: { uuid: '2f60f81b-6d16-4c57-93a8-fd1a87926c25' } },
    role: { connect: { uuid: roles.group_owner.uuid } },
  },
  {
    uuid: '183e1686-432d-4242-a6d8-6b06a6e7c6d1',
    user: { connect: { uuid: users.user2.uuid } },
    group: { connect: { uuid: 'a3d3df3e-3de3-429d-905d-2c313bea906a' } },
    role: { connect: { uuid: roles.student.uuid } },
  },
]
