## Authentication

The User.login mutation creates a **jwt token**. That token, passed on the `Authorization` header ("Bearer [token]"), is used to authenticate the user.

When context is created we inject a method to retrieve the user data in the context so that it can be used if the auth user is needed. We inject that method and not the user data, because the user data does not need to be loaded in every request. Only when needed.

On open endpoints we don't want the user to be queried unnecessarily.

It's important to notice that when the user is not authenticated and we ask for the current user, an unauthenticated user is returned. So that method will always return a user with its permissions, even the user is the unauthenticated user. This choice was made to simplify all the authorization process, given that we don't need to be checking for authentication and then authorization everytime. The question is always gonna be about permissions. Unauthenticated users also have an 'unauthenticated' role and permissions.

## Authorization

### model

In our model we have membership relating users to specific groups, roles and permissions.

<pre>
user n-1 membership 1-n group
            1
            |
            n
      MembershipRole
            n
            |
            n
        permission
</pre>

We have opted to add permissions in the backend because that will release the frontend from doing all kinds of checks to show specific functionality. Those checks should always be based in a specific permission.

This decisions was made with two things in mind, both related with the DRY principle:

- this checks are already done in backend, so we should not repeat them in the frontend
- when we use multiple clients, we should not be rewriting this code in multiple places

### implementation and api

In the context we also injects an auth object that can be used to check for permissions.

The authorization is given or not using the `authorize` check provided by the nexus' [fieldAuthorizePlugin](https://nexusjs.org/docs/plugins/field-authorize). Resolvers can provide an `authorize` function that will run to check for authorization.

### possible unfoldings

This memberhsipRole/permission based approach is also very interesting to create a **feature flag** enablement functionality.

By flagging some specific users or groups, we could assign a custom role with extended functionalit just to some users. That would have the same effect of a feature flag, but without the need to define a new api just for that.
