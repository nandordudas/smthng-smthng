import { type Express } from 'express'

import { createRouter } from '../../helpers'
import { authRouter } from './routes/auth'
import { homeRouter } from './routes/home'
import { userRouter } from './routes/user'

export const apiV1Routes = (app: Express) =>
  createRouter().use('/v1', [
    app.use('/', homeRouter),
    app.use('/auth', authRouter),
    app.use('/user', userRouter),
  ])
