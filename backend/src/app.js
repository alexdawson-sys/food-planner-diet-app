import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { authRoutes } from './routes/authRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { weightRoutes } from './routes/weightRoutes.js';
import { mealRoutes } from './routes/mealRoutes.js';
import { foodRoutes } from './routes/foodRoutes.js';
import { recipeRoutes } from './routes/recipeRoutes.js';
import { mealPlanRoutes } from './routes/mealPlanRoutes.js';
import { analyticsRoutes } from './routes/analyticsRoutes.js';
import { requireAuth } from './middleware/auth.js';
import { sanitizeRequest } from './middleware/sanitize.js';

dotenv.config();

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || '*',
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(sanitizeRequest);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/users', requireAuth, userRoutes);
app.use('/weight', requireAuth, weightRoutes);
app.use('/meals', requireAuth, mealRoutes);
app.use('/foods', requireAuth, foodRoutes);
app.use('/recipes', requireAuth, recipeRoutes);
app.use('/meal-plans', requireAuth, mealPlanRoutes);
app.use('/analytics', requireAuth, analyticsRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong', detail: error.message });
});
