import { Router } from 'express'
import healthRoutes from './health.routes.js'
import authRoutes from './auth.routes.js'
import gymRoutes from './gyms.routes.js'
import membershipRoutes from './memberships.routes.js'
import memberRoutes from './members.routes.js'
import planRoutes from './plans.routes.js'
import paymentRoutes from './payment.routes.js'
import checkInRoutes from './checkIns.routes.js'
import partnerRoutes from './partner.routes.js'
import passRoutes from './pass.routes.js'
import adminRoutes from './admin.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/gyms', gymRoutes)
router.use('/memberships', membershipRoutes)
router.use('/members', memberRoutes)
router.use('/plans', planRoutes)
router.use('/payments', paymentRoutes)
router.use('/check-ins', checkInRoutes)
router.use('/partner', partnerRoutes)
router.use('/pass', passRoutes)
router.use('/admin', adminRoutes)

export default router
