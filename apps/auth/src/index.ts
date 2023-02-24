import type { AddressInfo } from 'node:net'

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

runner(({ httpServer, webSocketServer }) => {
  webSocketServer.on('connection', (ws) => {
    logger.info('WebSocket starting client')

    setInterval(() => ws.send('connected'), 3_000)

    ws.on('message', (message) => {
      logger.info(JSON.parse(message.toString()))
    })

    ws.on('error', (error) => {
      logger.error(error)
    })

    ws.on('close', () => {
      logger.info('stopping client')
    })
  })

  webSocketServer.on('close', () => {
    logger.info('websocket disconnected')
  })

  httpServer.listen(Number(process.env.PORT) || 3333, 'localhost', () => {
    const protocol = 'http' // because of 'node:http'
    const { address, port } = httpServer.address() as AddressInfo

    logger.info(`Listening on ${protocol}://${address}:${port}/`)
  })
})
