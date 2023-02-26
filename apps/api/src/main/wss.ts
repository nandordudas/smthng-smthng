import { type WebSocket, WebSocketServer } from 'ws'

interface User {}

const clients = new WeakMap<User, WebSocket>()
const connections = new WeakSet<WebSocket>()

export const wss = new WebSocketServer({
  noServer: true,
  path: '/ws',
})

wss.on('connection', (ws, _request) => {
  connections.add(ws)

  ws.on('error', console.error)

  ws.on('pong', (_data) => {
    connections.add(ws)
  })

  clients.set({ id: '__userId__' }, ws)

  ws.on('message', (data, isBinary) => {
    // eslint-disable-next-line no-console
    console.log('message', {
      data: isBinary ? '-.-' : JSON.parse(data.toString()),
      isBinary,
    })

    setInterval(() => {
      ws.send(JSON.stringify(process.memoryUsage()))
    }, 500)
  })

  ws.on('close', () => {
    // eslint-disable-next-line no-console
    console.log('close')
    clients.delete({ id: '__userId__' })
  })
})

const heartBeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.CLOSING || ws.readyState === ws.CLOSED)
      return

    if (connections.has(ws))
      return ws.ping()

    ws.close()
  })
}, 30_000)

wss.on('close', () => {
  clearInterval(heartBeatInterval)
})
