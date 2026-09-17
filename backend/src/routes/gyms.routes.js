import { Router } from 'express';
import { listGyms, getGymDetail } from '../controllers/gyms.controller.js';

const router = Router();

router.get('/', listGyms);
router.get('/:idOrSlug', getGymDetail);

export default router;
