let ws: WebSocket | null = new WebSocket('ws://localhost:3333/ws', 'smthng')

let isOpened = false

ws.addEventListener('error', (event) => {
  console.error('[game.worker]: error', event)
})

ws.addEventListener('open', (_event) => {
  isOpened = true

  postMessage({ isOpened })
}, { once: true })

ws.addEventListener('close', (_event) => {
  isOpened = false
  ws = null

  postMessage({ isOpened })
})

ws.addEventListener('message', (event) => {
  postMessage({ ...JSON.parse(event.data), isOpened })
})

addEventListener('message', (_event) => {
  if (!ws || ws.readyState !== WebSocket.OPEN)
    return

  ws.send(JSON.stringify({ event: 'custom', value: '🤔' }))
})

export {}
