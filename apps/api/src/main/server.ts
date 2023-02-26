import { createServer } from 'node:http'

import { app } from './app'
import { wss } from './wss'

export const server = createServer(app)

server.on('error', console.error)

server.on('upgrade', (request, socket, head) => {
  socket.on('error', console.error)

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
})