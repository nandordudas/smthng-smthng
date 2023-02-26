import { createRouter } from '../helpers'

export const faviconRouter = createRouter()

// 1x1 pixel image/png
const favicon = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC',
  'base64',
)

faviconRouter.get('/favicon.ico', (_request, response) => {
  response
    .setHeader('Content-Length', favicon.length)
    .setHeader('Content-Type', 'image/x-icon')
    .status(200)
    .end(favicon)
})
