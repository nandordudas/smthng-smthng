import type { Server } from 'node:http'
import { WebSocketServer } from 'ws'

export function createWsServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' })

  return wss
}
