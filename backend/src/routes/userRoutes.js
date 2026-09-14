import { Router } from 'express';
import { getProfile, updateGoals, updateProfile } from '../controllers/userController.js';

export const userRoutes = Router();

userRoutes.get('/profile', getProfile);
userRoutes.put('/profile', updateProfile);
userRoutes.put('/goals', updateGoals);
