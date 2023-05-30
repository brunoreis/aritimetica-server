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