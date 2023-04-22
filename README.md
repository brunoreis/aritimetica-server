## Env configuration

In the local env, configurations are put on .env. 
On heroku you need to define env vars per service. 
You can rename `.env.example` to `.env` on your first installation. 
`.env` is excluded from the repo in `.gitignore` and won't be persisted. 

You can define the type of the expected `process.env` object in `/environment.d.ts`

## Architecture

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

### Authentication and Authorization

## Local Installation

1. Clone this repo and install dependencies

```
yarn install
```
2. Start a DB and point the server to it

- You can use the provided docker-composer to start a postgres container and use it on local development. 
```
docker-compose up
```
- Or create and point to a RDS database. 
  - Remember to open the inbound 5432 port to the public. 

- The database connection in configured in prisma/schema.prisma. And it's referencing the `DATABASE_URL` in the environmnet variable. 
    - To set that locally, do it on the `.env` file. 
    - This is how you should build the [connection url](https://www.prisma.io/docs/reference/database-reference/connection-urls). 


3. Create the first migration if the `/prisma/migrations` is empty

```
yarn prisma:migrate
```

4. Reset and seed the database. 
*Take care, this will reset and add seed data to your DB*

```
yarn prisma:reset_and_seed
```
5. Start the GraphQL server

```
yarn dev
```

6. Explore the runnung app with the sandbox:
- You can access the [sandbox](https://studio.apollographql.com/sandbox/explorer) and put the address of you localhost server: [http://localhost:4000](http://localhost:4000)

- Optionally you can also install and play with [GraphQL Playground](https://github.com/prisma/graphql-playground).


### Evolving the app

Evolving the application typically requires two steps:

1. Migrate your model and database
1.1 Change the model on schema.prisma
1.2 Run prisma migrate to create a migrations and update the db
```yarn prisma:migrate```
[Typical Prisma Workflows](https://www.prisma.io/docs/concepts/overview/what-is-prisma#typical-prisma-workflows)

2. Update your application code, adding or adjusting a type or a resolver.
When you do so, the nexus dev server will automatically generate the appropriate `schema.graphql` and `nexus-typegen.ts` files.

## Deploy Pipeline

This app is being deployed to heroku with the following pipeline: 

**New PRs** will deploy **Review Apps**
you can check them on the github PR

**Merges on main** will get **deployed to prod**. 