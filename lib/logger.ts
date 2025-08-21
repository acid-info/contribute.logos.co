import pino from 'pino'

const logLevel = process.env.LOG_LEVEL || 'info'

export const logger = pino({
  level: logLevel,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() }
    },
  },
  serializers: {
    err: pino.stdSerializers.err,
  },
})

export default logger
