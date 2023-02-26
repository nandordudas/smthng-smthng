import cors, { type CorsOptions } from 'cors'
import { type Options as RateLimitOptions, rateLimit } from 'express-rate-limit'
import type { OptionsUrlencoded } from 'body-parser'
import { json, urlencoded } from 'express'
import helmet from 'helmet'

import { catchAllRoutes, errorHandler, faviconRouter } from '../middlewares'

const corsOptions: CorsOptions = {
  credentials: true,
}

const rateLimitOptions: Partial<RateLimitOptions> = {
  legacyHeaders: false,
  max: 100,
  standardHeaders: true,
  windowMs: 15 * 60 * 1_000,
}

const urlEncodedoptions: OptionsUrlencoded = {
  extended: true,
}

export const presetMiddlewares = [
  json(),
  urlencoded(urlEncodedoptions),
  helmet(),
  cors(corsOptions),
  rateLimit(rateLimitOptions),
  faviconRouter,
  catchAllRoutes(),
  errorHandler(),
]
