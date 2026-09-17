import { getMemberProfile, getMemberActivity, getMemberSavedGyms, saveGym, unsaveGym } from '../services/members.service.js';

export const getMe = async (req, res, next) => {
  try {
    const profile = await getMemberProfile(req.memberId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const getMyActivity = async (req, res, next) => {
  try {
    const activity = await getMemberActivity(req.memberId);
    res.json(activity);
  } catch (error) {
    next(error);
  }
};

export const getSavedGyms = async (req, res, next) => {
  try {
    const savedGyms = await getMemberSavedGyms(req.memberId);
    res.json(savedGyms);
  } catch (error) {
    next(error);
  }
};

export const toggleSavedGym = async (req, res, next) => {
  try {
    const { gymId } = req.params;
    if (req.method === 'POST') {
      const saved = await saveGym(req.memberId, gymId);
      res.json(saved);
    } else {
      await unsaveGym(req.memberId, gymId);
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
};
