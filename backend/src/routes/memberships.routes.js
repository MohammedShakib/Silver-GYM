import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { getMyMembership } from '../controllers/memberships.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getMyMembership);

export default router;
