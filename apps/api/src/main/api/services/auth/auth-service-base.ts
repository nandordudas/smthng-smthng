import type { sign } from 'async-jsonwebtoken'
import type { Router } from 'express'

import type { RequestHandlerParams } from '../../../../types'

export abstract class AuthServiceBase {
  constructor(protected router: Router) {}

  abstract login(...params: RequestHandlerParams): Promise<void>
  abstract logout(...params: RequestHandlerParams): Promise<void>
  abstract me(...params: RequestHandlerParams): Promise<void>
  abstract register(...params: RequestHandlerParams): Promise<void>
  abstract signAccessToken(userId: string): ReturnType<typeof sign>
  abstract verifyAccessToken(...params: RequestHandlerParams): Promise<void>
}
