import { createServer } from 'node:http'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import type { RouterMap } from '../types'
import { logger } from './logger'
import { getDefaultRouter } from './default-router'

export function createApp(apiRoutes: RouterMap) {
  const app = express()

  logger.info('Setup security')

  app
    .use(helmet())
    .use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    }))
    .use((request, _response, next) => {
      logger.info(request.url)
      next()
    })

  apiRoutes.forEach((routes, version) => app.use(version, routes))
  logger.info('Api routes added')
  app.use(getDefaultRouter())
  logger.info('Default middlewares added')

  const server = createServer(app)

  return { app, server }
}
