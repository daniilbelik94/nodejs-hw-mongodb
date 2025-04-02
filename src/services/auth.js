import User from '../models/user.js';
import Session from '../models/session.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createSession = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = uuidv4();

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Delete any existing session
  await Session.deleteOne({ userId });

  // Create new session
  return await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
};