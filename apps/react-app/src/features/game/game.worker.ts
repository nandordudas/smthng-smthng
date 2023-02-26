let ws: WebSocket | null = new WebSocket('ws://localhost:3333/ws')

ws.addEventListener('error', (event) => {
  console.error('[game.worker]: error', event)
})

ws.addEventListener('open', (event) => {
  // eslint-disable-next-line no-console
  console.log('[game.worker]: open', event)
})

ws.addEventListener('close', (event) => {
  // eslint-disable-next-line no-console
  console.log('[game.worker]: close', event)

  ws = null
})

ws.addEventListener('message', (event) => {
  // eslint-disable-next-line no-console
  console.log('[game.worker]: message', JSON.parse(event.data))
  postMessage(JSON.parse(event.data))
})

addEventListener('message', (event) => {
  // eslint-disable-next-line no-console
  console.log('[game.worker]: message', event)

  if (!ws)
    return

  if (ws.readyState !== WebSocket.OPEN)
    return

  ws.send(JSON.stringify({
    event: 'custom',
    value: '🤔',
  }))
})

export {}
