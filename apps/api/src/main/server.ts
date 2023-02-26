import { createServer } from 'node:http'

import { app, errorHandler, presetMiddlewares } from './app'
import { logger } from './utils/logger'
import { wss } from './wss'

export const server = createServer(app.use(presetMiddlewares, errorHandler()))

server.on('error', (error) => {
  logger.error(`server ${error}`)
})

server.on('upgrade', (request, socket, head) => {
  socket.on('error', (error) => {
    logger.error(`server upgrade ${error}`)
  })

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
})
