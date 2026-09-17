import { searchGyms, getGym } from '../services/gyms.service.js';

export const listGyms = async (req, res, next) => {
  try {
    const { search, area, lat, lng, radius } = req.query;
    const gyms = await searchGyms({ search, area, lat, lng, radius });
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
