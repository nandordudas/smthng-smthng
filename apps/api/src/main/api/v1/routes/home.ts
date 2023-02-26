import { createRouter } from '../../../helpers'

export const homeRouter = createRouter()

homeRouter.get('/', (_request, response) => {
  response.status(200).send({ message: 'home' })
})
