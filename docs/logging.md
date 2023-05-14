We use [pino](https://getpino.io/#/) for logging. [This is a very good guide](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/#getting-started-with-pino) on using pino

Pino is create with the server in the `server.ts` file. It's injected into the context and can be used all around the graphql server. 

It also logs the server lifecycle events.

When there is an **error in the authorize** method in the graphql fields, it's **swallowed** by the fieldAuthorizerPlugin. So we recomend you wrap those authorize methods with a try catch block and log exceptions there. 
