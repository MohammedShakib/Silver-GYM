import { searchGyms, getGym } from '../services/gyms.service.js';

export const listGyms = async (req, res, next) => {
  try {
    const filters = {
      ...req.query,
      userId: req.auth?.userId
    };
    const gyms = await searchGyms(filters);
    res.json(gyms);
  } catch (error) {
    next(error);
  }
};

export const getGymDetail = async (req, res, next) => {
  try {
    const gym = await getGym(req.params.idOrSlug);
    res.json(gym);
  } catch (error) {
    next(error);
  }
};
