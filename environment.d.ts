declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET_KEY: string;
      LOG_PRISMA_QUERIES: string;
      LOG_LEVEL: string;
    }
  }
}

export {}
