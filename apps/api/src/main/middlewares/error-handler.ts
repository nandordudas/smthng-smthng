import type { ErrorRequestHandler } from 'express'
import createHttpError, { type HttpError } from 'http-errors'

const internalServerError = createHttpError.InternalServerError()

export function errorHandler(): ErrorRequestHandler {
  return (error, _request, response, next) => {
    if (response.headersSent)
      return next(internalServerError)

    const {
      message = internalServerError.message,
      statusCode = internalServerError.statusCode,
    } = error as HttpError // 👀

    response.status(statusCode).send({ message, statusCode })
  }
}
