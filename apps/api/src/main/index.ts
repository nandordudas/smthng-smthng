import type { AddressInfo } from 'node:net'

import { server } from './server'
import { logger } from './utils/logger'

const port = Number(process.env?.PORT) || 3333

server.listen(port, 'localhost', () => {
  const { address, port } = server.address() as AddressInfo

  logger.info(`server listening on http://${address}:${port}/`)
})
