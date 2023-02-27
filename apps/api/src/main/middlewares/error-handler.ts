import type { ErrorRequestHandler } from 'express'
import createHttpError, { type HttpError } from 'http-errors'

import { logger } from '../utils/logger'

const internalServerError: HttpError = createHttpError.InternalServerError()

export function errorHandler(): ErrorRequestHandler {
  return (error, request, response, next) => {
    if (response.headersSent)
      return next(internalServerError)

    logger.error(`${request.url} ${error.message}`)
    response.status(internalServerError.statusCode).send(internalServerError)
  }
}
