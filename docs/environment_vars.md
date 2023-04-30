## Env configuration

In the local env, configurations are put on .env. 
On heroku you need to define env vars per service. 
You can rename `.env.example` to `.env` on your first installation. 
`.env` is excluded from the repo in `.gitignore` and won't be persisted. 

You can define the type of the expected `process.env` object in `/environment.d.ts`