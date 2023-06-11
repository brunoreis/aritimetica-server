import pino from 'pino'

export function createLogger() {
  const targets = [
    {
      target: 'pino-pretty',
      level: process.env.LOG_LEVEL,
      options: {},
    },
  ]

  if (process.env.LOGTAIL_TOKEN) {
    targets.push({
      target: '@logtail/pino',
      options: { sourceToken: process.env.LOGTAIL_TOKEN },
      level: process.env.LOG_LEVEL,
    })
  }

  const pinoLogger = pino({
    transport: { targets },
  })
  return pinoLogger.child({ env: process.env.NODE_ENV })
}
