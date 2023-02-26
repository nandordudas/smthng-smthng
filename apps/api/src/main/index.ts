import type { AddressInfo } from 'node:net'

import { server } from './server'

server.listen(3333, 'localhost', () => {
  const { address, port } = server.address() as AddressInfo

  // eslint-disable-next-line no-console
  console.log(`Listening on http://${address}:${port}/`)
})
