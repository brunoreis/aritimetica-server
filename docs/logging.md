We use [pino](https://getpino.io/#/) for logging. [This is a very good guide](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/#getting-started-with-pino) on using pino

Pino is create with the server in the `server.ts` file. It's injected into the context and can be used all around the graphql server. 

It also logs the server lifecycle events.

When there is an **error in the authorize** method in the graphql fields, it's **swallowed** by the fieldAuthorizerPlugin. So we recomend you wrap those authorize methods with a try catch block and log exceptions there. 

#### log level

Pino will use the LOG_LEVEL env var to set the log level it will use. 
You can also change that level at **runtime** by calling the `changeLogLevel` GraphQL operation. Please notice that, if you run the app on multiple instances, this will set that level in one unique instance. 

#### redact sensitive data

Please check these docs if you need to redact data so that you don't store pii or any other sensitive information in the logs: 
https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/#keeping-sensitive-data-out-of-your-logs

#### Transports

We are using two transports, `pino-pretty` for console logging and  [LogTail](https://betterstack.com/logtail) as a remote log management tool. 

As you can see in `server.ts`, to config the LogTail logs you will neen to set the LOGTAIL_TOKEN env var. 

You can also use another [transport](https://github.com/pinojs/pino/blob/master/docs/transports.md) to redirect logs to you prefered logging management tool. 