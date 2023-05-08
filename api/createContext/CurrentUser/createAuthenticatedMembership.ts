export const createAuthenticatedMembership = (permissions: { uuid: string; }[]): { group: { uuid: string; name: string; }; role: { uuid: string; permissions: { uuid: string; }[]; }; } => {
  return {
    group: {
      uuid: 'app',
      name: 'App'
    },
    role: {
      uuid: 'authenticated',
      permissions
    }
  };
};
