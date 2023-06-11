const hashed_password_secretPassword123 =
  '$2b$10$CqlCrFqv5KlEeg926QRAaOAft2t/dINTreuFkn1irQnQl7W.WClNq'

export const users = {
  unauthenticated: {
    uuid: 'unauthenticated',
    email: 'unauthenticated@example.com',
    name: 'Unauthenticated User',
    password: '',
  },
  admin: {
    uuid: 'admin',
    email: 'admin@example.com',
    name: 'Admin',
    password: hashed_password_secretPassword123,
  },
  teacher: {
    uuid: 'cfd7d883-93a6-4f15-b7a8-cba0ffc52363',
    email: 'teacher@example.com',
    password: hashed_password_secretPassword123,
    name: 'Teacher',
  },
  user1: {
    uuid: 'c1f875d9-1889-42f3-8c3b-5f5aa35d1a5f',
    email: 'user1@example.com',
    password: hashed_password_secretPassword123,
    name: 'User 1',
  },
  user2: {
    uuid: 'a918c10a-6d89-4f67-b814-14b86c9e60d2',
    email: 'user2@example.com',
    password: hashed_password_secretPassword123,
    name: 'User 2',
  },
}
