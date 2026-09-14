import { Router } from 'express';
import { createWeightEntry, getWeightHistory, getWeightStats } from '../controllers/weightController.js';

export const weightRoutes = Router();

weightRoutes.post('/', createWeightEntry);
weightRoutes.get('/history', getWeightHistory);
weightRoutes.get('/stats', getWeightStats);
