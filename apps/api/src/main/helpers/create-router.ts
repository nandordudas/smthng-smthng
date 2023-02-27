import { Router } from 'express'

import { defaultMiddleWares } from '../config/middlewares'

export function createRouter(): Router {
  const router = Router({
    caseSensitive: true,
    strict: true,
  })

  router.use(defaultMiddleWares)

  return router
}
