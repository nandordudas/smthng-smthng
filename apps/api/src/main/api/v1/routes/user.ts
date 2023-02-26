import { createRouter } from '../../../helpers'

export const userRouter = createRouter()

userRouter.get('/', (_request, response) => {
  response.send({ message: 'user' })
})
