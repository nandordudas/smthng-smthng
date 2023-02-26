import debug from 'debug'

export const createDebugger = (...args: Parameters<typeof debug>) => debug(...args)
