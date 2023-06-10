import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateGroupResponse = {
  __typename?: 'CreateGroupResponse';
  errorMessage?: Maybe<Scalars['String']['output']>;
  group?: Maybe<Group>;
  membership?: Maybe<Membership>;
};

export type Group = {
  __typename?: 'Group';
  name?: Maybe<Scalars['String']['output']>;
  uuid: Scalars['String']['output'];
};

export type InitialScreen = LessonsScreen | UsersScreen;

export type Lesson = {
  __typename?: 'Lesson';
  assignee?: Maybe<User>;
  assigneeUuid?: Maybe<Scalars['String']['output']>;
  assigner?: Maybe<User>;
  assignerUuid?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['String']['output']>;
};

export type LessonsScreen = {
  __typename?: 'LessonsScreen';
  user?: Maybe<User>;
};

export enum Level {
  Debug = 'debug',
  Error = 'error',
  Fatal = 'fatal',
  Info = 'info',
  Trace = 'trace',
  Warn = 'warn'
}

export type LoginResponse = {
  __typename?: 'LoginResponse';
  errorMessage?: Maybe<Scalars['String']['output']>;
  jwt?: Maybe<Scalars['String']['output']>;
  screen?: Maybe<InitialScreen>;
};

export type Membership = {
  __typename?: 'Membership';
  group?: Maybe<Group>;
  groupUuid?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Role>;
  roleUuid?: Maybe<Scalars['String']['output']>;
  userUuid?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeLogLevel: Scalars['Boolean']['output'];
  createGroup: CreateGroupResponse;
  login: LoginResponse;
};


export type MutationChangeLogLevelArgs = {
  level?: InputMaybe<Level>;
};


export type MutationCreateGroupArgs = {
  name: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Permission = {
  __typename?: 'Permission';
  roles?: Maybe<Array<Maybe<Role>>>;
  uuid?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  user: User;
  users: Array<Maybe<User>>;
};


export type QueryUserArgs = {
  userUuid: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  memberships?: Maybe<Array<Maybe<Membership>>>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  title?: Maybe<Scalars['String']['output']>;
  uuid?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  assignedLessons?: Maybe<Array<Lesson>>;
  email?: Maybe<Scalars['String']['output']>;
  memberships?: Maybe<Array<Maybe<Membership>>>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  receivedLessons?: Maybe<Array<Lesson>>;
  uuid?: Maybe<Scalars['String']['output']>;
};

export type UsersScreen = {
  __typename?: 'UsersScreen';
  user?: Maybe<User>;
};

export type CreateGroupMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'CreateGroupResponse', errorMessage?: string | null, group?: { __typename?: 'Group', uuid: string, name?: string | null } | null, membership?: { __typename?: 'Membership', uuid?: string | null, roleUuid?: string | null, groupUuid?: string | null, userUuid?: string | null } | null } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', jwt?: string | null, errorMessage?: string | null, screen?: { __typename: 'LessonsScreen', user?: { __typename?: 'User', uuid?: string | null, email?: string | null, name?: string | null, receivedLessons?: Array<{ __typename?: 'Lesson', uuid?: string | null, title?: string | null }> | null } | null } | { __typename: 'UsersScreen', user?: { __typename?: 'User', uuid?: string | null, email?: string | null, name?: string | null, memberships?: Array<{ __typename?: 'Membership', role?: { __typename?: 'Role', uuid?: string | null, title?: string | null } | null, group?: { __typename?: 'Group', uuid: string, name?: string | null } | null } | null> | null } | null } | null } };


export const CreateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"roleUuid"}},{"kind":"Field","name":{"kind":"Name","value":"groupUuid"}},{"kind":"Field","name":{"kind":"Name","value":"userUuid"}}]}}]}}]}}]} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jwt"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"screen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UsersScreen"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LessonsScreen"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"receivedLessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;