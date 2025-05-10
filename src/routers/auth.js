import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { register, login, refresh, logout } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

// POST /auth/register
router.post('/register', validateBody(registerSchema), ctrlWrapper(register));

// POST /auth/login
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));

// POST /auth/refresh
router.post('/refresh', ctrlWrapper(refresh));

// POST /auth/logout
router.post('/logout', ctrlWrapper(logout));

export default router;