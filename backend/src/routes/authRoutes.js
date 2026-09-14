import { Router } from 'express';
import { login, refreshToken, register } from '../controllers/authController.js';

export const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/refresh-token', refreshToken);
