import { permissions } from './permissions'

export const membershipRoles = {
  // app memberhipRoles
  unauthenticated: {
    uuid: 'unauthenticated',
    title: 'Unauthenticated',
    permissions: {
      connect: { uuid: permissions.log_in.uuid },
    },
  },
  authenticated: {
    uuid: 'authenticated',
    title: 'Authenticated',
    permissions: {
      connect: [
        { uuid: permissions.log_out.uuid },
        { uuid: permissions.view_my_received_lessons.uuid },
        { uuid: permissions.view_my_user.uuid },
        { uuid: permissions.create_lesson.uuid },
        { uuid: permissions.view_users.uuid },
      ],
    },
  },

  // group memberhipRoles
  group_owner: {
    uuid: 'group_owner',
    title: 'Group Owner',
    permissions: {
      connect: [
        { uuid: permissions.view_users.uuid },
        { uuid: permissions.view_received_lessons.uuid },
        { uuid: permissions.create_user_into_group.uuid },
        { uuid: permissions.change_user_group_roles.uuid },
      ],
    },
  },
  teacher: {
    uuid: 'teacher',
    title: 'Teacher',
    permissions: {
      connect: [
        { uuid: permissions.assign_lesson.uuid },
        { uuid: permissions.answer_assigned_lesson.uuid },
        { uuid: permissions.view_all_lessons_of_any_user_in_this_group.uuid },
      ],
    },
  },
  student: {
    uuid: 'student',
    title: 'Student',
    permissions: {
      connect: [{ uuid: permissions.answer_assigned_lesson.uuid }],
    },
  },
}
