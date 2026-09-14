import { Router } from 'express';
import { getDailyAnalytics, getMonthlyAnalytics, getWeeklyAnalytics } from '../controllers/analyticsController.js';

export const analyticsRoutes = Router();

analyticsRoutes.get('/daily', getDailyAnalytics);
analyticsRoutes.get('/weekly', getWeeklyAnalytics);
analyticsRoutes.get('/monthly', getMonthlyAnalytics);
