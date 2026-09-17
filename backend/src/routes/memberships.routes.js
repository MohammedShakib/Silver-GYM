import { Router } from 'express';
import { authMock } from '../middlewares/authMock.js';
import { getMyMembership } from '../controllers/memberships.controller.js';

const router = Router();

router.use(authMock);

router.get('/', getMyMembership);

export default router;
