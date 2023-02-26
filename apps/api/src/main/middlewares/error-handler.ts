import type { ErrorRequestHandler } from 'express'

export function errorHandler(): ErrorRequestHandler {
  return (error, _request, response, next) => {
    if (response.headersSent)
      return next(error)

    const {
      message = 'Internal Server Error',
      status = 500,
    } = error

    response.status(status).send({ message, status })
  }
}
