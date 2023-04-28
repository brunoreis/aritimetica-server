type Permission = {
  uuid: string
}

type Role = {
  uuid: string
  permissions: Permission[]
}

type Group = {
  uuid: string
  name: string
}

type Membership = {
  group: Group
  role: Role
}

type UserDataType = {
  uuid: string
  email: string
  name: string
  memberships: Membership[]
}

export type { UserDataType }
