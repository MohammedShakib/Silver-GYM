import { Router } from 'express';
import { getPlans, getPlanById } from '../controllers/plans.controller.js';

const router = Router();

router.get('/', getPlans);
router.get('/:idOrSlug', getPlanById);

export default router;
