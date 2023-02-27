import type { Request, Response, Router } from 'express'
import createHttpError from 'http-errors'
import { compare, hash } from 'bcrypt'
import type { Logger } from 'pino'
import { type PrismaClient, prisma } from '@workspace/database'

import { _AuthServiceBase } from './_AuthServiceBase'
import { loginSchema, refreshTokenSchema, registerSchema } from './registerSchema'
import { TokenManager } from './TokenManager'
import { SALT_ROUNDS } from './constants'
import { api } from './api'

export class AuthService extends _AuthServiceBase {
  constructor(
    override _router: Router,
    override _logger: Logger,
    protected _prisma: PrismaClient,
  ) {
    super(_router, _logger)
  }

  @api({ method: 'post', path: '/register' })
  override async register(request: Request, response: Response) {
    const { body: data } = await this.validate(registerSchema, request)

    data.password = await hash(data.password, SALT_ROUNDS)

    const user = await prisma.user.create({ data })
    const [accessToken, error] = await TokenManager.signAccessToken(user)

    if (error)
      throw new createHttpError.InternalServerError()

    const refreshToken = await TokenManager.signRefreshToken(user)

    response.status(201).send({ email: user.email, accessToken, refreshToken })
  }

  @api({ method: 'post', path: '/login' })
  override async login(request: Request, response: Response) {
    const { body: data } = await this.validate(loginSchema, request)
    const user = await prisma.user.findFirst({
      where: { email: data.email },
    })

    if (!user)
      throw createHttpError.NotFound()

    const passwordMatch = await compare(data.password, user.password)

    if (!passwordMatch)
      throw createHttpError.Unauthorized()

    const [accessToken, error] = await TokenManager.signAccessToken(user)

    if (error)
      throw new createHttpError.InternalServerError()

    const refreshToken = await TokenManager.signRefreshToken(user)

    response.status(200).send({ accessToken, refreshToken })
  }

  @api({ method: 'post', path: '/refresh-token' })
  override async refreshToken(request: Request, response: Response) {
    const { body } = await this.validate(refreshTokenSchema, request)
    const { refresh_token } = body

    if (!refresh_token)
      throw createHttpError.BadRequest()

    const user = await TokenManager.verifyRefreshToken(refresh_token)
    const [accessToken, accessTokenError] = await TokenManager.signAccessToken(user)

    if (accessTokenError)
      throw new createHttpError.InternalServerError()

    const refreshToken = await TokenManager.signRefreshToken(user)

    response.status(200).send({ accessToken, refreshToken })
  }

  @api({ method: 'get', path: '/me', middlewares: [TokenManager.verifyAccessToken] })
  async me(request: Request, response: Response) {
    response.status(200).send('ok, it\'s me')
  }

  @api({ method: 'get', path: '/logout', middlewares: [TokenManager.verifyAccessToken] })
  async logout(_request: Request, response: Response) {
    response.status(200).send('logout')
  }
}
