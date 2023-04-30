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
