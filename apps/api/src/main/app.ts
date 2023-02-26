import express, { type Router } from 'express'

import { apiV1Routes } from './api/v1/routes'

const apiroutePrefix = '/api'

export const app = express()

app.use(apiroutePrefix, [
  apiV1Routes(app),
  // ...extend with new routers here
] satisfies Router[])

export { presetMiddlewares } from './config/middlewares'
