type AuthorizerType = {
  loggedIn: () => Promise<boolean>
  hasGlobalPermission: (permission: string) => Promise<boolean>
  hasGroupPermission: (permission: string) => Promise<boolean>
}

export type { AuthorizerType }
