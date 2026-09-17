import { Router } from 'express';
import { authMock } from '../middlewares/authMock.js';
import { getMe, getMyActivity, getSavedGyms, toggleSavedGym } from '../controllers/members.controller.js';

const router = Router();

router.use(authMock);

router.get('/', getMe);
router.get('/activity', getMyActivity);
router.get('/saved-gyms', getSavedGyms);
router.post('/saved-gyms/:gymId', toggleSavedGym);
router.delete('/saved-gyms/:gymId', toggleSavedGym);

export default router;
