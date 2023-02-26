import { AsyncLocalStorage } from 'node:async_hooks'
import type { AddressInfo } from 'node:net'
import { v4 } from 'uuid'
import { WebSocket } from 'ws'

import { createRouter, createRunner, logger } from './utils'

const runner = createRunner(
  new Map([
    ['/v1', createRouter()
      .get('/', (_request, response) => {
        response.status(200).send({ message: 'ok', status: 200 })
      }),
    ],
  ]),
)

const clients = new WeakMap()
const asyncLocalStorage = new AsyncLocalStorage()

function logWithId(msg: string) {
  const id = asyncLocalStorage.getStore()

  console.log(`${id !== undefined ? id : '-'}:`, msg)
}

let idSeq = 0

runner(({ httpServer, webSocketServer }) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start')

    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish')
      // res.end()
    })
  })

  webSocketServer.on('connection', (socket, _request) => {
    logger.info('connected')

    const { searchParams } = new URL(_request.url!, `http://${_request.headers.host}`)
    const id = searchParams.get('id') ?? v4()

    setInterval(() => {
      if (socket.readyState !== WebSocket.OPEN)
        return

      const payload = {
        type: 'event',
        value: 'connected',
        id,
        time: new Date().toISOString(),
      }

      socket.send(JSON.stringify(payload), { binary: false })
    }, 1_000)

    clients.set(socket, { username: 'test', id })

    socket.on('message', (data, isBinary) => {
      const clientMetadata = clients.get(socket)
      const username = clientMetadata.username

      logger.info({ ...JSON.parse(data.toString()), isBinary, username })
    })

    socket.on('error', (error) => {
      logger.error(`socket error ${error}`)
    })

    socket.on('close', (code, reason) => {
      logger.info('stopping client', { code, reason })
      clients.delete(socket)
    })
  })

  webSocketServer.on('error', (error) => {
    logger.error(`error: ${error}`)
  })

  webSocketServer.on('close', () => {
    logger.info('disconnected')
  })

  httpServer.listen(Number(process.env.PORT) || 3333, 'localhost', () => {
    const protocol = 'http' // because of 'node:http'
    const { address, port } = httpServer.address() as AddressInfo

    logger.info(`Listening on ${protocol}://${address}:${port}/`)
  })
})
