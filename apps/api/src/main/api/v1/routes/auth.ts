import { prisma } from '@workspace/database'

import { logger } from '../../../utils/logger'
import { AuthService } from '../../services'
import { router } from '../../services/auth/router'

export const { router: authRouter } = new AuthService(
  router,
  logger,
  prisma,
)
