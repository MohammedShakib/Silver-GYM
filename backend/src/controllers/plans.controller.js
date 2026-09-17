import { getAllPlans, getPlan } from '../services/plans.service.js';

export const getPlans = async (req, res, next) => {
  try {
    const plans = await getAllPlans();
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

export const getPlanById = async (req, res, next) => {
  try {
    const plan = await getPlan(req.params.idOrSlug);
    res.json(plan);
  } catch (error) {
    next(error);
  }
};
