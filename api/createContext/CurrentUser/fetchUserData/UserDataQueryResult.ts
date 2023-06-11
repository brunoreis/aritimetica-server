export type UserDataQueryResult = {
  uuid: string
  email: string
  name: string
  memberships: {
    group: {
      uuid: string
      name: string
    }
    role: {
      uuid: string
      permissions: {
        uuid: string
      }[]
    }
  }[]
} | null
