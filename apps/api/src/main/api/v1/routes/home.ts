import { createRouter } from '../../../helpers'

export const homeRouter = createRouter()

homeRouter.get('/', (_request, response) => {
  response.send({ message: 'home' })
})
