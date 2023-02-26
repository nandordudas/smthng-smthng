import type { RequestHandler } from 'express'
import createHttpError from 'http-errors'

export function catchAllRoutes(): RequestHandler {
  return (_request, _response, next) => next(createHttpError.NotFound())
}
