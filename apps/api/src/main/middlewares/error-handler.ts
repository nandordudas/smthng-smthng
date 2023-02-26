import type { ErrorRequestHandler } from 'express'
import createHttpError, { type HttpError } from 'http-errors'

export function errorHandler(): ErrorRequestHandler {
  return (error, _request, response, next) => {
    const internalServerError = createHttpError.InternalServerError()

    if (response.headersSent)
      return next(internalServerError)

    const {
      message = internalServerError.message,
      statusCode = internalServerError.statusCode,
    } = error as HttpError // 👀

    response.status(statusCode).send({ message, statusCode })
  }
}
