import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { getMe, getMyActivity, getSavedGyms, toggleSavedGym } from '../controllers/members.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getMe);
router.get('/activity', getMyActivity);
router.get('/saved-gyms', getSavedGyms);
router.post('/saved-gyms/:gymId', toggleSavedGym);
router.delete('/saved-gyms/:gymId', toggleSavedGym);

export default router;
