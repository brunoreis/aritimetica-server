This is a GraphQL server. It's built using three main tools/layers: 

### DB / ORM / Prisma

[Prisma](https://www.prisma.io/docs) is a tool we use to generate ORM models to create and interact with the database.

[Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client) is an auto-generated and type-safe query builder to run queries over the defined prisma model. 

On prisma we:
- define the db schema 
- generate the database using that schema
- migrate the databe based on diffs on that schema
- build queries to interact with the underlying DB

Looking at `package.json` we can see where prisma's configurations are: 
```
"prisma": {
    "schema": "prisma/schema.prisma",
    "seed": "ts-node prisma/seed.ts"
}
```

The `schema.prisma` file defines the db we are using: 
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

and also the data model. Based on that data model the db is created and migrated. Prisma is able to diff between the current db state and the data model and create migrations. 

Migrations live on `/prisma/migrations`

To start a new db you should run `yarn prisma:migrate`
Then to insert seed data: `yarn prisma:seed`
To see your data on [prisma studio](https://github.com/prisma/studio) run: `npx prisma studio`

#### DB

The db is managed by prisma. In this project we have a `docker-compose.yml` file with two helpful services, a postgres server and a pgadmin server. If you run these services (`docker-compose up`), you will have a local instance of a PG database and also the [pgadmin](https://www.pgadmin.org/) platform to see the data on your database and manage it. 

The DATABASE_URL local env configuration can point either to the local container or to any other db instance, like the aws RDS used in prod. 

### GraphQL / Server

Our GraphQL layer is built with the well known `apollo-server`, using a code based schema tool called [Nexus](https://nexusjs.org/). Nexus is responsible for reading the code inside `/api/graphql` and translating that into a schema used by apollo-server. 

The **code based schema** approach is very productive since it auto generates the types and schema we need, removing the need of a lot of boilerplate we usually have on most GraphQL servers. 

### Evolving the app

Evolving the application typically requires two steps:

1. Migrate your model and database
1.1 Change the model on schema.prisma
1.2 Run prisma migrate to create a migrations and update the db
```yarn prisma:migrate```
[Typical Prisma Workflows](https://www.prisma.io/docs/concepts/overview/what-is-prisma#typical-prisma-workflows)

2. Update your application code, adding or adjusting a type or a resolver.
When you do so, the nexus dev server will automatically generate the appropriate `schema.graphql` and `nexus-typegen.ts` files.

### docs

please check the docs folder for further information