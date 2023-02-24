import type { Router } from 'express'

export type ApiVersion = '/v1'

export type RouterMap = Map<ApiVersion, Router>
