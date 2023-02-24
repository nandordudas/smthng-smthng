import type { Server } from 'node:http'
import type { WebSocketServer } from 'ws'

import type { RouterMap } from '../types'
import { createApp } from './create-app'
import { createWsServer } from './create-ws-server'

interface CurriedParams {
  httpServer: Server
  webSocketServer: WebSocketServer
}

type RunnerFunc = (callback: (args: CurriedParams) => void) => void

export function createRunner(apiRoutes: RouterMap): RunnerFunc {
  return (callback) => {
    const { server: httpServer } = createApp(apiRoutes)
    const webSocketServer = createWsServer(httpServer)

    return callback({ httpServer, webSocketServer })
  }
}
