import { Router } from 'express';
import { createMeal, deleteMeal, getMealsToday, updateMeal } from '../controllers/mealController.js';

export const mealRoutes = Router();

mealRoutes.post('/', createMeal);
mealRoutes.get('/today', getMealsToday);
mealRoutes.put('/:id', updateMeal);
mealRoutes.delete('/:id', deleteMeal);
