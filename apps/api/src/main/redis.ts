import { createClient } from 'redis'

import { logger } from './utils/logger'

export const redis = createClient({
  url: 'redis://default:redis@redis:6379',
})

redis.on('error', (error) => {
  logger.error(`redis ${error}`)
})

redis.on('connect', () => {
  logger.info('redis connected')
})

redis.on('ready', () => {
  logger.info('redis ready')
})

redis.on('end', () => {
  logger.error('redis disconnected')
})

process.on('SIGINT', () => {
  redis.quit()
})

redis.connect()
