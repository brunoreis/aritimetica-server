type Permission = {
  uuid: string
}

type MembershipRole = {
  uuid: string
  permissions: Permission[]
}

type Group = {
  uuid: string
  name: string
}

type Membership = {
  group: Group
  membershipRole: MembershipRole
}

type UserDataType = {
  uuid: string
  email: string
  name: string
  memberships: Membership[]
}

export type { UserDataType }
