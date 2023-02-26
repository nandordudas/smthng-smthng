import express, { type Router, json, urlencoded } from 'express'

import { catchAllRoutes, errorHandler, faviconRouter } from './middlewares'
import { apiV1Routes } from './api/v1/routes'

export const app = express()

const routes: Router[] = [
  apiV1Routes(app),
  // add new routers
]

app.use(json())
app.use(urlencoded({ extended: true }))
// TODO: add missing middlewares (helmet, rate limiter, morgan, ...)
app.use(faviconRouter)
app.use('/api', routes)
app.use(catchAllRoutes())
app.use(errorHandler())
