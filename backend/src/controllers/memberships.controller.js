import * as membershipsService from '../services/memberships.service.js';
import * as billingService from '../services/billing.service.js';

export const getMyMembership = async (req, res, next) => {
  try {
    const membership = await membershipsService.getCurrentMembership(req.memberId);
    res.json(membership);
  } catch (error) {
    next(error);
  }
};

export const pauseMembership = async (req, res, next) => {
  try {
    const result = await membershipsService.pauseMembership(req.memberId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const cancelMembership = async (req, res, next) => {
  try {
    const result = await membershipsService.cancelMembership(req.memberId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyInvoices = async (req, res, next) => {
  try {
    const invoices = await billingService.getInvoices(req.memberId);
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};
