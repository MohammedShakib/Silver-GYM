import { Router } from 'express';
import { listGyms, getGymDetail } from '../controllers/gyms.controller.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', optionalAuth, listGyms);
router.get('/:idOrSlug', getGymDetail);

export default router;
