import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: './logs/combined.log', level: 'error' }),
  ],
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize({ all: true }),
    format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
  ),
})
