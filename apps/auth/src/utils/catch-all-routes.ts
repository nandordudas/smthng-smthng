import type { ErrorRequestHandler, RequestHandler } from 'express'

import { logger } from './logger'

export function catchAllRoutes(): RequestHandler {
  return (_request, response) => {
    logger.info('Page not found')
    response.status(404).json({ message: 'Page not found', status: 404 })
  }
}

export function errorHandler(): ErrorRequestHandler {
  return (error, request, response, next) => {
    logger.error(error, request.url)

    if (response.headersSent) {
      logger.error('Header already sent')

      return next(error)
    }

    const { message, status } = error

    response.status(status).json({ message, status })
  }
}
