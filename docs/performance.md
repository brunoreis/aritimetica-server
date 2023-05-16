#### reducing n-1 queries
    
Prisma query service runs as a separate service and it does not have yet a way to know the context of the query passed to it. So we are not able to add context to the query logs (request/trace/user ids).

https://github.com/prisma/prisma/issues/7596

But we are able to count the number of queries anyway by looking at the logs in an isolated environment as the local one. To help on that we have added a query count to the end of the log string. 

A common challenge using GraphQL resolvers are n-1 queries caused by unexpected relations being added by the clients to the queries. One of the proposed approaches to that is to use an implementation of the [DataLoader](https://www.apollographql.com/docs/apollo-server/data/fetching-data/) pattern. 

Since prisma has a similar approach in the database query engine, we have opted to recomend using prisma `include` fields. We have provided a `getRequestedFields` implementation that will help you determine the relationships included in the GraphQL query and eager load them, avoiding the n-1 query issue. Please check the `user` resolver as an example. 


    