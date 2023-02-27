import cors, { type CorsOptions } from 'cors'
import { type Options as RateLimitOptions, rateLimit } from 'express-rate-limit'
import type { OptionsUrlencoded } from 'body-parser'
import { type RequestHandler, json, urlencoded } from 'express'
import helmet from 'helmet'

import { catchAllRoutes } from '../middlewares'

const corsOptions: CorsOptions = {
  credentials: true,
}

const rateLimitOptions: Partial<RateLimitOptions> = {
  legacyHeaders: false,
  max: 100,
  standardHeaders: true,
  windowMs: 15 * 60 * 1_000,
}

const urlEncodedOptions: OptionsUrlencoded = {
  extended: true,
}

export const defaultMiddleWares: RequestHandler[] = [
  json(),
  urlencoded(urlEncodedOptions),
  helmet(),
  cors(corsOptions),
  rateLimit(rateLimitOptions),
]

export const presetMiddlewares: RequestHandler[] = [
  catchAllRoutes(),
]
