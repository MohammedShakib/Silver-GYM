import prisma from '../utils/prisma.js';
import { ApiError, ErrorCodes } from '../utils/errors.js';
import { hashPassword, verifyPassword, generateSessionToken, hashSessionToken } from '../utils/auth.js';

const SESSION_COOKIE_NAME = 'silver_gym_session';
const SESSION_TTL_DAYS = 7;
const isProd = process.env.NODE_ENV === 'production';

const setSessionCookie = (res, token) => {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60 * 1000 // ms
  });
};

const clearSessionCookie = (res) => {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/'
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Name, email, and password are required');
    }
    
    if (password.length < 8) {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Password must be at least 8 characters long');
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Check duplicate
    const existing = await prisma.member.findUnique({
      where: { email: normalizedEmail }
    });
    if (existing) {
      throw new ApiError(409, ErrorCodes.VALIDATION_ERROR, 'Email already in use');
    }

    const hashedPassword = await hashPassword(password);
    
    // Generate memberCode (simple logic for now)
    const count = await prisma.member.count();
    const memberCode = `SG-${1000 + count}-NEW`;

    const user = await prisma.member.create({
      data: {
        memberCode,
        name,
        email: normalizedEmail,
        phone,
        passwordHash: hashedPassword,
        role: 'MEMBER'
      }
    });

    // Create session
    const token = generateSessionToken();
    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        memberId: user.id,
        tokenHash,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    setSessionCookie(res, token);
    
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new ApiError(400, ErrorCodes.VALIDATION_ERROR, 'Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    const user = await prisma.member.findUnique({
      where: { email: normalizedEmail }
    });
    
    // Generic error
    const authError = new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

    if (!user) throw authError;

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) throw authError;
    
    if (user.status === 'SUSPENDED') {
      throw new ApiError(403, 'ACCOUNT_SUSPENDED', 'Your account has been suspended');
    }

    if (user.status === 'DISABLED') {
      throw new ApiError(403, 'ACCOUNT_DISABLED', 'Your account has been disabled');
    }

    // Create session
    const token = generateSessionToken();
    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        memberId: user.id,
        tokenHash,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    setSessionCookie(res, token);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies[SESSION_COOKIE_NAME];
    
    if (token) {
      const tokenHash = hashSessionToken(token);
      await prisma.session.deleteMany({
        where: { tokenHash }
      });
    }

    clearSessionCookie(res);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    // Relying on requireAuth middleware to set req.auth
    const user = await prisma.member.findUnique({
      where: { id: req.auth.userId }
    });

    if (!user) {
      throw new ApiError(401, 'UNAUTHORIZED', 'User not found');
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      status: user.status
    });
  } catch (error) {
    next(error);
  }
};
