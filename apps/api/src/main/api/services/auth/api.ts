import type { RequestHandler } from 'express'

import { asyncWrapper } from '../../../helpers'
import { router } from './router'

interface Options {
  method: 'get' | 'post' | 'put' | 'delete'
  middlewares?: RequestHandler[]
  path: string
}

export function api(options: Options) {
  return (target: any, propertyKey: string, _descriptor: PropertyDescriptor) => {
    const method = target[propertyKey].bind(target)
    const isAsync = method[Symbol.toStringTag] === 'AsyncFunction'

    router[options.method](options.path, options.middlewares || [], isAsync ? asyncWrapper(method) : method)
  }
}
