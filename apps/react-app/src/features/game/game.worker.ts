let ws: WebSocket | null = new WebSocket('ws://localhost:3333/ws')

ws.addEventListener('error', (event) => {
  console.error('[game.worker]: error', event)
})

ws.addEventListener('open', (_event) => {
  //
})

ws.addEventListener('close', (_event) => {
  ws = null
})

ws.addEventListener('message', (event) => {
  postMessage(JSON.parse(event.data))
})

addEventListener('message', (_event) => {
  if (!ws || ws.readyState !== WebSocket.OPEN)
    return

  ws.send(JSON.stringify({ event: 'custom', value: '🤔' }))
})

export {}
