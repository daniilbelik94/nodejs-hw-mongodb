import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

// POST /auth/register
router.post('/register', validateBody(registerSchema), register);

// POST /auth/login
router.post('/login', validateBody(loginSchema), login);

// POST /auth/refresh
router.post('/refresh', refresh);

// POST /auth/logout
router.post('/logout', authenticate, logout);

export default router;