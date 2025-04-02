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
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    // Find session
    const session = await Session.findOne({ refreshToken });
    if (!session || session.refreshTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Refresh token is invalid or expired');
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
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token not provided');
    }

    // Delete session
    await Session.deleteOne({ refreshToken });

    // Clear cookie
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};