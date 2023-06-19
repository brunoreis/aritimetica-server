/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { InitialScreenSource } from "./../api/graphql/mutations/login/InitialScreen"
import type { UserSource } from "./../api/graphql/types/User"
import type { MembershipSource } from "./../api/graphql/types/Membership"
import type { GroupSource } from "./../api/graphql/types/Group"
import type { LessonSource } from "./../api/graphql/types/Lesson"
import type { RoleSource } from "./../api/graphql/types/Role"
import type { PermissionSource } from "./../api/graphql/types/Permission"
import type { UsersScreenSource } from "./../api/graphql/types/UsersScreen"
import type { LessonsScreenSource } from "./../api/graphql/types/LessonsScreen"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  Level: "debug" | "error" | "fatal" | "info" | "trace" | "warn"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  CreateGroupResponse: { // root type
    errorMessage?: string | null; // String
    group?: NexusGenRootTypes['Group'] | null; // Group
  }
  CreateUserResponse: { // root type
    errorMessage?: string | null; // String
    user?: NexusGenRootTypes['User'] | null; // User
  }
  Group: GroupSource;
  Lesson: LessonSource;
  LessonsScreen: LessonsScreenSource;
  LoginResponse: { // root type
    errorMessage?: string | null; // String
    jwt?: string | null; // String
    screen?: NexusGenRootTypes['InitialScreen'] | null; // InitialScreen
  }
  Membership: MembershipSource;
  Mutation: {};
  Permission: PermissionSource;
  Query: {};
  Role: RoleSource;
  User: UserSource;
  UsersScreen: UsersScreenSource;
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
  InitialScreen: InitialScreenSource;
}

export type NexusGenRootTypes = NexusGenObjects & NexusGenUnions

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  CreateGroupResponse: { // field return type
    errorMessage: string | null; // String
    group: NexusGenRootTypes['Group'] | null; // Group
  }
  CreateUserResponse: { // field return type
    errorMessage: string | null; // String
    user: NexusGenRootTypes['User'] | null; // User
  }
  Group: { // field return type
    memberships: Array<NexusGenRootTypes['Membership'] | null> | null; // [Membership]
    name: string | null; // String
    uuid: string | null; // String
  }
  Lesson: { // field return type
    assignee: NexusGenRootTypes['User'] | null; // User
    assigneeUuid: string | null; // String
    assigner: NexusGenRootTypes['User'] | null; // User
    assignerUuid: string | null; // String
    title: string | null; // String
    uuid: string | null; // String
  }
  LessonsScreen: { // field return type
    user: NexusGenRootTypes['User'] | null; // User
  }
  LoginResponse: { // field return type
    errorMessage: string | null; // String
    jwt: string | null; // String
    screen: NexusGenRootTypes['InitialScreen'] | null; // InitialScreen
  }
  Membership: { // field return type
    group: NexusGenRootTypes['Group'] | null; // Group
    groupUuid: string | null; // String
    role: NexusGenRootTypes['Role'] | null; // Role
    roleUuid: string | null; // String
    userUuid: string | null; // String
    uuid: string | null; // String
  }
  Mutation: { // field return type
    changeLogLevel: boolean; // Boolean!
    createGroup: NexusGenRootTypes['CreateGroupResponse']; // CreateGroupResponse!
    createUser: NexusGenRootTypes['CreateUserResponse']; // CreateUserResponse!
    login: NexusGenRootTypes['LoginResponse']; // LoginResponse!
  }
  Permission: { // field return type
    roles: Array<NexusGenRootTypes['Role'] | null> | null; // [Role]
    uuid: string | null; // String
  }
  Query: { // field return type
    user: NexusGenRootTypes['User']; // User!
    users: Array<NexusGenRootTypes['User'] | null>; // [User]!
  }
  Role: { // field return type
    memberships: Array<NexusGenRootTypes['Membership'] | null> | null; // [Membership]
    permissions: Array<NexusGenRootTypes['Permission'] | null> | null; // [Permission]
    title: string | null; // String
    uuid: string | null; // String
  }
  User: { // field return type
    assignedLessons: NexusGenRootTypes['Lesson'][] | null; // [Lesson!]
    email: string | null; // String
    memberships: Array<NexusGenRootTypes['Membership'] | null> | null; // [Membership]
    name: string | null; // String
    password: string | null; // String
    receivedLessons: NexusGenRootTypes['Lesson'][] | null; // [Lesson!]
    uuid: string | null; // String
  }
  UsersScreen: { // field return type
    user: NexusGenRootTypes['User'] | null; // User
  }
}

export interface NexusGenFieldTypeNames {
  CreateGroupResponse: { // field return type name
    errorMessage: 'String'
    group: 'Group'
  }
  CreateUserResponse: { // field return type name
    errorMessage: 'String'
    user: 'User'
  }
  Group: { // field return type name
    memberships: 'Membership'
    name: 'String'
    uuid: 'String'
  }
  Lesson: { // field return type name
    assignee: 'User'
    assigneeUuid: 'String'
    assigner: 'User'
    assignerUuid: 'String'
    title: 'String'
    uuid: 'String'
  }
  LessonsScreen: { // field return type name
    user: 'User'
  }
  LoginResponse: { // field return type name
    errorMessage: 'String'
    jwt: 'String'
    screen: 'InitialScreen'
  }
  Membership: { // field return type name
    group: 'Group'
    groupUuid: 'String'
    role: 'Role'
    roleUuid: 'String'
    userUuid: 'String'
    uuid: 'String'
  }
  Mutation: { // field return type name
    changeLogLevel: 'Boolean'
    createGroup: 'CreateGroupResponse'
    createUser: 'CreateUserResponse'
    login: 'LoginResponse'
  }
  Permission: { // field return type name
    roles: 'Role'
    uuid: 'String'
  }
  Query: { // field return type name
    user: 'User'
    users: 'User'
  }
  Role: { // field return type name
    memberships: 'Membership'
    permissions: 'Permission'
    title: 'String'
    uuid: 'String'
  }
  User: { // field return type name
    assignedLessons: 'Lesson'
    email: 'String'
    memberships: 'Membership'
    name: 'String'
    password: 'String'
    receivedLessons: 'Lesson'
    uuid: 'String'
  }
  UsersScreen: { // field return type name
    user: 'User'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    changeLogLevel: { // args
      level?: NexusGenEnums['Level'] | null; // Level
    }
    createGroup: { // args
      name: string; // String!
    }
    createUser: { // args
      addToGroupUuid?: string | null; // String
      email: string; // String!
      name: string; // String!
      password: string; // String!
    }
    login: { // args
      email: string; // String!
      password: string; // String!
    }
  }
  Query: {
    user: { // args
      userUuid: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  InitialScreen: "LessonsScreen" | "UsersScreen"
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = keyof NexusGenUnions;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "InitialScreen";

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}