import cors from 'cors'
import { type RequestHandler, json, urlencoded } from 'express'
import morgan, { type StreamOptions } from 'morgan'

import { logger } from './logger'
import { createRouter } from './create-router'
import { catchAllRoutes, errorHandler } from './catch-all-routes'

export function getDefaultRouter() {
  const stream: StreamOptions = {
    write: message => logger.http(message),
  }

  const middlewares: RequestHandler[] = [
    morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms', { stream }),
    cors({ credentials: true }),
    json(),
    urlencoded({ extended: true }),
    catchAllRoutes(),
  ]

  const router = createRouter().use(middlewares).use(errorHandler())

  logger.info('Default router initialized')

  return router
}
