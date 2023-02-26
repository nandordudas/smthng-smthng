import { Router } from 'express'

import { app } from '../app'
import { homeRouter } from './routes/home'
import { userRouter } from './routes/user'

const router = Router({
  caseSensitive: true,
  strict: true,
})

export const routes = router.use('/v1', [
  app.use('/', homeRouter),
  app.use('/user', userRouter),
])
