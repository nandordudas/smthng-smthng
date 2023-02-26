import { Router } from 'express'

export const userRouter = Router()

userRouter.get('/', (_request, response) => {
  response.send({ message: 'user' })
})
