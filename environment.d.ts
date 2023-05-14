declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET_KEY: string;
      LOG_PRISMA_QUERIES: string;
      LOG_LEVEL: LogLevel;
    }
  }
}

declare enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
}

export {}
