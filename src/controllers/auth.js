import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { createSession, findUserByEmail } from '../services/auth.js';
import User from '../models/user.js';
import Session from '../models/session.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      throw createHttpError(401, 'Email or password is incorrect');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Email or password is incorrect');
    }

    // Create session
    const session = await createSession(user._id);

    // Set refresh token in cookies
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    console.log('Refresh token received:', refreshToken);
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    // Find session
    const session = await Session.findOne({ refreshToken });
    console.log('Session found:', session);
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    // Check if refresh token is expired
    if (session.refreshTokenValidUntil < new Date()) {
      await Session.deleteOne({ refreshToken });
      throw createHttpError(401, 'Refresh token expired');
    }

    // Create new session
    const newSession = await createSession(session.userId);

    // Set new refresh token in cookies
    res.cookie('refreshToken', newSession.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: newSession.accessToken,
      },
    });
  } catch (error) {
    console.error('Refresh error:', error.message);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    console.log('Refresh token received for logout:', refreshToken);
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    // Find and delete session
    const session = await Session.findOneAndDelete({ refreshToken });
    console.log('Session deleted during logout:', session);
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    // Clear cookie
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    console.error('Logout error:', error.message);
    next(error);
  }
};