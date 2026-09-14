import { Router } from 'express';
import { createCustomFood, getFavorites, searchFoods } from '../controllers/foodController.js';

export const foodRoutes = Router();

foodRoutes.get('/search', searchFoods);
foodRoutes.post('/custom', createCustomFood);
foodRoutes.get('/favorites', getFavorites);
