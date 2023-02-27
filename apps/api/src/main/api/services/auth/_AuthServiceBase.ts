import type { Router } from 'express'
import type { Logger } from 'pino'

import type { RequestHandlerParams } from '../../../../types'
import { RequestServiceBase } from './RequestServiceBase'

export abstract class _AuthServiceBase extends RequestServiceBase {
  constructor(
    override _router: Router,
    override _logger: Logger,
  ) {
    super(_router, _logger)
  }

  abstract register(...params: RequestHandlerParams): Promise<void>
  abstract login(...params: RequestHandlerParams): Promise<void>
  abstract refreshToken(...params: RequestHandlerParams): Promise<void>
}
