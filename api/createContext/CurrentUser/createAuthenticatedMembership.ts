export const createAuthenticatedMembership = (
  permissions: { uuid: string }[],
): {
  group: { uuid: string; name: string }
  membershipRole: { uuid: string; permissions: { uuid: string }[] }
} => {
  return {
    group: {
      uuid: 'app',
      name: 'App',
    },
    membershipRole: {
      uuid: 'authenticated',
      permissions,
    },
  }
}
