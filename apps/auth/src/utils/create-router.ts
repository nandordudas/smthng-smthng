import { Router } from 'express'

export function createRouter() {
  return Router({
    caseSensitive: true,
    strict: true,
  })
}
