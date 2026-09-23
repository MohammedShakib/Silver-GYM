import prisma from '../utils/prisma.js';
import { hashSessionToken } from '../utils/auth.js';
import { ApiError } from '../utils/errors.js';

const SESSION_COOKIE_NAME = 'silver_gym_session';

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies[SESSION_COOKIE_NAME];
    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required');
    }

    const tokenHash = hashSessionToken(token);
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { member: true }
    });

    if (!session || session.expiresAt < new Date()) {
      res.clearCookie(SESSION_COOKIE_NAME);
      throw new ApiError(401, 'UNAUTHORIZED', 'Session expired or invalid');
    }

    const user = session.member;
    if (user.status === 'SUSPENDED') {
      throw new ApiError(403, 'ACCOUNT_SUSPENDED', 'Your account has been suspended');
    }
    if (user.status === 'DISABLED') {
      throw new ApiError(403, 'ACCOUNT_DISABLED', 'Your account has been disabled');
    }

    // Update lastUsedAt asynchronously
    prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() }
    }).catch(console.error);

    req.auth = {
      userId: user.id,
      role: user.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies[SESSION_COOKIE_NAME];
    if (!token) {
      return next();
    }

    const tokenHash = hashSessionToken(token);
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { member: true }
    });

    if (session && session.expiresAt > new Date()) {
      const user = session.member;
      if (user.status !== 'SUSPENDED' && user.status !== 'DISABLED') {
        req.auth = {
          userId: user.id,
          role: user.role
        };
      }
    }
    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to access this resource'));
    }
    next();
  };
};

export const requireGymAccess = async (req, res, next) => {
  try {
    const { gymId } = req.params;
    
    // Admins have implicit access to everything
    if (req.auth.role === 'ADMIN') {
      return next();
    }
    
    // Check GymStaff relationship
    const staff = await prisma.gymStaff.findUnique({
      where: {
        memberId_gymId: {
          memberId: req.auth.userId,
          gymId
        }
      }
    });

    if (!staff || !staff.active) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have access to manage this gym');
    }

    // Attach staff context if needed later
    req.gymStaff = staff;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireGymPermission = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (req.auth.role === 'ADMIN') {
        return next();
      }
      
      if (!req.gymStaff) {
        throw new ApiError(403, 'FORBIDDEN', 'Gym staff context missing. Ensure requireGymAccess is called first.');
      }
      
      if (!allowedRoles.includes(req.gymStaff.role)) {
        throw new ApiError(403, 'FORBIDDEN', 'Your gym staff role does not have permission for this action.');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
