import { JsonWebTokenError, type SignOptions, sign, verify } from 'async-jsonwebtoken'
import type { NextFunction, Request, Response, Router } from 'express'
import createHttpError from 'http-errors'
import { compare, hash } from 'bcrypt'
import type { Logger } from 'pino'

import { AuthServiceBase } from './auth-service-base'

const access_token_secret = '9zc3H9XKm52ofb5sVTrTYmZADuRFOac6'
// eslint-disable-next-line unused-imports/no-unused-vars
const refresh_token_secret = '0fgt0eTkvaG6r4lbwpuB7DVoWngc4RWB'

// it's getting from database >>> need some test boi...
const userPassword = '$2b$10$nZIrokKuvox/nWbF34Fbk./A3777WgOrR8gbalL/wWO/jBwatdy0i'

const bearerLeadingRegExp = /^Bearer /
const saltRounds = 10
const signOptions: SignOptions = {
  expiresIn: '1h',
  issuer: 'localhost',
}

export class AuthService extends AuthServiceBase {
  constructor(public router: Router, private logger: Logger) {
    super(router)

    this.#init()
  }

  override async verifyAccessToken(request: Request, _response: Response, next: NextFunction) {
    const { authorization } = request.headers

    if (!authorization)
      return next(createHttpError.Unauthorized())

    const token = authorization.replace(bearerLeadingRegExp, '')
    const [decoded, error] = await verify(token, access_token_secret)

    if (error instanceof Error) {
      const message = error instanceof JsonWebTokenError ? undefined : error.message

      this.logger.error(`AuthService.verifyAccessToken ${error}`)

      return next(createHttpError.Unauthorized(message))
    }

    this.logger.info(`AuthService.verifyAccessToken ${JSON.stringify({ decoded, error })}`)

    // @ts-expect-error payload key doesn't exists
    request.payload = decoded

    next()
  }

  override async me(_request: Request, response: Response) {
    response.status(200).send('ok, it\'s me')
  }

  override async register(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body

    this.logger.info(await hash(password, saltRounds))

    delete request.body.password

    const [token, error] = await this.signAccessToken(email)

    if (error) {
      this.logger.error(`AuthService.register ${error}`)

      return next(createHttpError.Unauthorized())
    }

    response.status(200).send({ email, token })
  }

  override login = async (request: Request, response: Response, next: NextFunction) => {
    const { email, password } = request.body

    delete request.body.password

    const passwordMatch = await compare(password, userPassword)

    this.logger.info(`password matches: ${passwordMatch}`)

    const [token, error] = await this.signAccessToken(email)

    if (error) {
      this.logger.error(`AuthService.login ${error}`)

      return next(createHttpError.Unauthorized())
    }

    response.status(200).send({ email, token })
  }

  override async logout(_request: Request, response: Response) {
    response.status(200).send('logout')
  }

  override async signAccessToken(userId: string) {
    const payload = {
      aud: userId,
    }

    const result = await sign(payload, access_token_secret, signOptions)

    return result
  }

  #init() {
    this.router.get('/logout', this.verifyAccessToken, this.logout)
    this.router.get('/me', this.verifyAccessToken, this.me)
    this.router.post('/login', this.login)
    this.router.post('/register', this.register)
  }
}
