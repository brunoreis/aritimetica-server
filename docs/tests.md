We have opted for testing this repo with integration tests, with a dedicated postgreSQL database.

Before running the tests, you will need to migrate/reset/seed that database with: 

```
yarn test:prisma:seed
```

If you look at that script you will notice that it will load some env vars from a different env file (`.test.env`). That's where the test database url and other configs are set. 

### testing resolvers

The test files are side by side with their respective graphql resolver and we can have multiple test files per operation in order to organize what we are testing. Tests usually have one graphQL call in a beforeAll and multiple assertions represented in different cases (`it("case", () => ...`). We organize the code this way so that the test results can be a good description on what to expect from that specific resolver. 

Integration tests are testing resolvers as black boxes, and thus we do have two boundaries: 
- the database
- the resolver api

Of course we could also understand the resolver api as the only boundary, but we decided to also test the db interactions, because that improves the quality and cohesion of some tests. Otherwise we would have to use multiple resolvers to test everything we need by creating, editing, deleting and removing documents from the system.

#### the test helper

`api/testHelpers.ts` define the methods we use to create the test GraphQL server and a client that will be used to query against that server. Using the provieded client we can query and check the response. 

The same file also provides a method to create a prisma client and check the database interaction results. 

#### the testing environment

We do have a `.test.env` file that is included when running the tests, overriding some env vars, as defined in `package.json`. That defines the log level and the specific database used on tests. The database is the one provided by the `postgres`container in the docker-compose file. 

#### cleaning up the test db

We have opted for integration tests that reach the db. To cleanup the db and add initial seed data, you need to run `test:prisma:seed`. 

Ideally tests should do a decent setup and tear down and not require this to run on every test run. Although, it may be good to run this command in the deployment pipelines. 

#### type safe tests

When writing the tests we recomend that you benefit from static type analysis even on the queries and mutations. 

By running `yarn codegen`, the typescript types are generated based on the graphql files found on our repo. All the generated types are then put on `/apiClientTypes.ts` and can be included in the tests. You can check `login.test.ts` to understand how to use `TypedDocumentNode` and type your query/mutation results. 
