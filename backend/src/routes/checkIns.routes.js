import { Router } from 'express';
import { authMock } from '../middlewares/authMock.js';
import { createCheckIn } from '../controllers/checkIns.controller.js';

const router = Router();

router.use(authMock);

router.post('/', createCheckIn);

export default router;
