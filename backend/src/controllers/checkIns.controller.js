import { processCheckIn } from '../services/checkIns.service.js';

export const createCheckIn = async (req, res, next) => {
  try {
    const { gymId, method } = req.body;
    const memberId = req.memberId;
    
    const result = await processCheckIn(memberId, gymId, method);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
