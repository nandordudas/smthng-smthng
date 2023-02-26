import { createRouter } from '../../../helpers'
import { AuthService } from '../../services'

export const { router: authRouter } = new AuthService(createRouter())
