import { Router } from 'express'

export function createRouter(): Router {
  const router = Router({
    caseSensitive: true,
    strict: true,
  })

  return router
}
