import { createRouter } from '../../helpers'
import { authRouter } from './routes/auth'
import { homeRouter } from './routes/home'
import { userRouter } from './routes/user'

const router = createRouter()
const versionRoutePrefix = '/v1'

export const apiV1Routes = createRouter().use(
  versionRoutePrefix, [
    router.use('/', homeRouter),
    router.use('/auth', authRouter),
    router.use('/user', userRouter),
  ],
)
