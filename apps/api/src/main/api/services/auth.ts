import type { NextFunction, Request, RequestHandler, Response, Router } from 'express'
import { JsonWebTokenError, type SignOptions, sign, verify } from 'async-jsonwebtoken'
import { compare, genSalt, hash } from 'bcrypt'
import createHttpError from 'http-errors'

const access_token_secret = '9zc3H9XKm52ofb5sVTrTYmZADuRFOac6'
// eslint-disable-next-line unused-imports/no-unused-vars
const refresh_token_secret = '0fgt0eTkvaG6r4lbwpuB7DVoWngc4RWB'

// it's getting from database >>> need some test boi...
const userPassword = '$2b$10$nZIrokKuvox/nWbF34Fbk./A3777WgOrR8gbalL/wWO/jBwatdy0i'

interface AuthBase {
  login(...params: Parameters<RequestHandler>): Promise<void>
  logout(...params: Parameters<RequestHandler>): Promise<void>
  me(...params: Parameters<RequestHandler>): Promise<void>
  register(...params: Parameters<RequestHandler>): Promise<void>
  signAccessToken(userId: string): Promise<string | null | undefined> // 👀
  verifyAccessToken(...params: Parameters<RequestHandler>): Promise<void>
}

// TODO: doesn't look good 🤔
abstract class AuthServiceBase implements AuthBase {
  constructor(public router: Router) {}

  abstract login(...params: Parameters<RequestHandler>): Promise<void>
  abstract logout(...params: Parameters<RequestHandler>): Promise<void>
  abstract me(...params: Parameters<RequestHandler>): Promise<void>
  abstract register(...params: Parameters<RequestHandler>): Promise<void>
  abstract signAccessToken(userId: string): Promise<Awaited<ReturnType<typeof sign>>[0]>
  abstract verifyAccessToken(...params: Parameters<RequestHandler>): Promise<void>
}

// TODO: extend main service with logger, ...
export class AuthService extends AuthServiceBase {
  constructor(public router: Router) {
    super(router)

    this.#init()
  }

  override async verifyAccessToken(request: Request, _response: Response, next: NextFunction) {
    const { authorization } = request.headers

    if (!authorization)
      return next(createHttpError.Unauthorized())

    const token = authorization.replace('Bearer ', '')
    const [decoded, error] = await verify(token, access_token_secret)

    if (error instanceof Error) {
      const message = error instanceof JsonWebTokenError ? undefined : error.message

      return next(createHttpError.Unauthorized(message))
    }

    // eslint-disable-next-line no-console
    console.log({ decoded, error })

    // @ts-expect-error payload key doesn't exists
    request.payload = decoded

    next()
  }

  override async me(_request: Request, response: Response) {
    response.status(200).send('ok, it\'s me')
  }

  override async register(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body

    // eslint-disable-next-line no-console
    console.log(await hash(password, await genSalt(10)))

    delete request.body.password

    const [token, error] = await this.signAccessToken(email)

    if (error)
      return next(createHttpError.Unauthorized())

    response.status(200).send({ email, token })
  }

  override login = async (request: Request, response: Response, next: NextFunction) => {
    const { email, password } = request.body

    // eslint-disable-next-line no-console
    console.log(await compare(password, userPassword))

    delete request.body.password

    const [token, error] = await this.signAccessToken(email)
  
    if (error)
      return next(createHttpError.Unauthorized())

    response.status(200).send({ email, token })
  }

  override async logout(_request: Request, response: Response) {
    response.status(200).send('logout')
  }

  override async signAccessToken(userId: string) {
    const payload = {}

    const options: SignOptions = {
      audience: userId,
      expiresIn: '1h',
      issuer: 'localhost',
    }

    const result = await sign(payload, access_token_secret, options)
  
    return result
  }

  #init() {
    this.router.get('/logout', this.verifyAccessToken, this.logout)
    this.router.get('/me', this.verifyAccessToken, this.me)
    this.router.post('/login', this.login)
    this.router.post('/register', this.register)
  }
}
