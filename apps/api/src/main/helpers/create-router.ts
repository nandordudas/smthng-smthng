import { Router } from 'express'

export function createRouter() {
  const router = Router({
    caseSensitive: true,
    strict: true,
  })

  return router
}
