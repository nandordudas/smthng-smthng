import { createRouter } from '../../../helpers'
import { logger } from '../../../utils/logger'
import { AuthService } from '../../services'

export const { router: authRouter } = new AuthService(createRouter(), logger)
