import { objectType } from 'nexus';

export const LoginResponse = objectType({
  name: 'LoginResponse',
  definition(t) {
    t.string('jwt');
    t.string('errorMessage');
    t.field('screen', { type: 'InitialScreen' });
  },
});
