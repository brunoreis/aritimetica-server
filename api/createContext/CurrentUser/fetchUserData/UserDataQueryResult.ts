export type UserDataQueryResult = {
  uuid: string
  email: string
  name: string
  memberships: {
    group: {
      uuid: string
      name: string
    }
    membershipRole: {
      uuid: string
      permissions: {
        uuid: string
      }[]
    }
  }[]
} | null
