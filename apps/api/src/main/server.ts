import { createServer } from 'node:http'

import { routes as routerV1 } from './v1/routes'
import { app } from './app'
import { wss } from './wss'

app.use(routerV1)

export const server = createServer(app)

server.on('error', console.error)

server.on('upgrade', (request, socket, head) => {
  socket.on('error', console.error)

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
})
