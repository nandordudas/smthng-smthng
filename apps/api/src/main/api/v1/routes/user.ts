import { createRouter } from '../../../helpers'

export const userRouter = createRouter()

userRouter.get('/', (_request, response) => {
  response.status(200).send({ message: 'user' })
})
