import type { Request } from 'express'
import createHttpError from 'http-errors'
import { type AnyZodObject, ZodError, type z } from 'zod'

import { ServiceBase } from './ServiceBase'

export class RequestServiceBase extends ServiceBase {
  validate<T extends AnyZodObject>(schema: T, request: Request): Promise<z.infer<T>> {
    try {
      return schema.parseAsync(request)
    }
    catch (error) {
      if (error instanceof ZodError)
        throw createHttpError.BadRequest(error.message)

      throw createHttpError.BadRequest()
    }
  }
}
