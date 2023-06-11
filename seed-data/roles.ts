export const roles = {
  // app roles
  unauthenticated: {
    uuid: 'unauthenticated',
    title: 'Unauthenticated',
    permissions: {
      connect: { uuid: 'log_in' },
    },
  },
  authenticated: {
    uuid: 'authenticated',
    title: 'Authenticated',
    permissions: {
      connect: [
        { uuid: 'log_out' },
        { uuid: 'view_my_received_lessons' },
        { uuid: 'view_my_user' },
        { uuid: 'create_lesson' },
        { uuid: 'view_users_of_my_groups' },
      ],
    },
  },
  admin: {
    uuid: 'admin',
    title: 'Admin',
    permissions: {
      connect: [{ uuid: 'view_all_users' }, { uuid: 'view_all_lessons' }],
    },
  },

  // group roles
  group_owner: {
    uuid: 'group_owner',
    title: 'Group Owner',
    permissions: {
      connect: [
        { uuid: 'invite_user_to_group' },
        { uuid: 'change_user_group_roles' },
      ],
    },
  },
  teacher: {
    uuid: 'teacher',
    title: 'Teacher',
    permissions: {
      connect: [
        { uuid: 'assign_lesson' },
        { uuid: 'answer_assigned_lesson' },
        { uuid: 'view_all_lessons_of_any_user_in_this_group' },
      ],
    },
  },
  student: {
    uuid: 'student',
    title: 'Student',
    permissions: {
      connect: [{ uuid: 'answer_assigned_lesson' }],
    },
  },
}
