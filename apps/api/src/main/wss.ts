import { WebSocket, WebSocketServer } from 'ws'
import { logger } from './utils/logger'

interface User {}

const clients = new WeakMap<User, WebSocket>()
const connections = new WeakSet<WebSocket>()

export const wss = new WebSocketServer({
  noServer: true,
  path: '/ws',
})

wss.on('connection', (ws) => {
  connections.add(ws)

  ws.on('error', (error) => {
    logger.error(`wss connection error ${error}`)
  })

  ws.on('pong', () => {
    connections.add(ws)
  })

  clients.set({ id: '__userId__' }, ws)

  ws.on('message', (data, isBinary) => {
    logger.info(`wss connection message ${JSON.stringify({
      data: isBinary ? '-.-' : JSON.parse(data.toString()),
      isBinary,
    })}`)

    setInterval(() => {
      ws.send(JSON.stringify(process.memoryUsage()))
    }, 500)
  })

  ws.on('close', () => {
    logger.info('wss connection close')
    clients.delete({ id: '__userId__' })
  })
})

const heartBeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING)
      return

    if (connections.has(ws))
      return ws.ping()

    ws.close()
  })
}, 30_000)

wss.on('close', () => clearInterval(heartBeatInterval))
