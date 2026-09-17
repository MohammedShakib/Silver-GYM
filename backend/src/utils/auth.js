import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password, hash) => {
  if (!hash) return false;
  return await bcrypt.compare(password, hash);
};

// Generates a random session token
export const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hashes a session token for storage (SHA-256 is fast and secure enough for tokens)
export const hashSessionToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
