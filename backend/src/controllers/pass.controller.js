import * as passService from '../services/pass.service.js';

export const generatePass = async (req, res, next) => {
  try {
    const memberId = req.memberId;
    const tokenData = await passService.generatePassToken(memberId);
    res.status(201).json(tokenData);
  } catch (error) {
    next(error);
  }
};
