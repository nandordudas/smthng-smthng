import { JsonWebTokenError, sign, verify } from 'async-jsonwebtoken'
import type { SignOptions } from 'async-jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { type User } from '@workspace/database'

import { redis } from '../../../redis'
import { ACCESS_TOKEN_SECRET, BEARER_LEADING_REG_EXP, REFRESH_TOKEN_SECRET } from './constants'

export class TokenManager {
  static async signRefreshToken(user: User) {
    const payload = {
      aud: user.id,
    }

    const signOptions: SignOptions = {
      expiresIn: '4w',
      issuer: 'localhost',
    }

    const [accessToken, error] = await sign(payload, REFRESH_TOKEN_SECRET, signOptions)

    if (error || !accessToken)
      throw new createHttpError.InternalServerError()

    await redis.set(user.id.toString(), accessToken, {
      EX: 28 * 24 * 60 * 60,
      NX: true,
    })

    return accessToken
  }

  static async verifyRefreshToken(token: string) {
    const [decoded, error] = await verify(token, REFRESH_TOKEN_SECRET)

    if (error instanceof Error) {
      const message = error instanceof JsonWebTokenError ? undefined : error.message

      throw createHttpError.Unauthorized(message)
    }

    return decoded as User
  }

  static async signAccessToken(user: User) {
    const payload = {
      aud: user.id,
    }

    const signOptions: SignOptions = {
      expiresIn: '1h',
      issuer: 'localhost',
    }

    const accessToken = await sign(payload, ACCESS_TOKEN_SECRET, signOptions)

    return accessToken
  }

  static async verifyAccessToken(request: Request, _response: Response, next: NextFunction) {
    const { authorization } = request.headers

    if (!authorization)
      return next(createHttpError.Unauthorized())

    const token = authorization.replace(BEARER_LEADING_REG_EXP, '')
    const [user, error] = await verify(token, ACCESS_TOKEN_SECRET)

    if (error instanceof Error) {
      const message = error instanceof JsonWebTokenError ? undefined : error.message

      return next(createHttpError.Unauthorized(message))
    }

    // @ts-expect-error payload key doesn't exists
    request.user = user

    next()
  }
}
