import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { getMyMembership, pauseMembership, cancelMembership, getMyInvoices } from '../controllers/memberships.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getMyMembership);
router.post('/pause', pauseMembership);
router.post('/cancel', cancelMembership);
router.get('/invoices', getMyInvoices);

export default router;
