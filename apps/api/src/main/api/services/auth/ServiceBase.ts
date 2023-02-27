import type { Router } from 'express'
import type { Logger } from 'pino'

export class ServiceBase {
  constructor(
    protected _router: Router,
    protected _logger: Logger,
  ) { }

  get router() {
    return this._router
  }
}
