import User from '../models/user.js';
import Session from '../models/session.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createSession = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = uuidv4();

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Delete any existing session
  console.log('Deleting existing session for userId:', userId);
  const deleteResult = await Session.deleteOne({ userId });
  console.log('Delete result:', deleteResult);

  // Create new session
  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  console.log('New session created:', session);

  return session;
};

export const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
};

export const verifyResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.email;
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
};

export const updateUserPassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await User.findOneAndUpdate(
    { email },
    { password: hashedPassword },
    { new: true }
  );
};