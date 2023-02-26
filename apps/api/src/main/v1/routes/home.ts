import { Router } from 'express'

export const homeRouter = Router()

homeRouter.get('/', (_request, response) => {
  response.send({ message: 'home' })
})
