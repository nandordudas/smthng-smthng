import type { RequestHandler } from 'express'

import type { RequestHandlerParams } from '../../../types'

export const asyncWrapper = <T>(handler: (...params: RequestHandlerParams) => Promise<T>): RequestHandler => {
  return (request, response, next) => handler(request, response, next).catch(next)
}
