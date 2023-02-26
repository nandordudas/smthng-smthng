import express, { type Router } from 'express'

import { apiV1Routes } from './api/v1/routes'

export const app = express()

const apiroutePrefix = '/api'

app.use(apiroutePrefix, [
  apiV1Routes,
] satisfies Router[])

export { presetMiddlewares } from './config/middlewares'
export { errorHandler } from './middlewares/error-handler'
