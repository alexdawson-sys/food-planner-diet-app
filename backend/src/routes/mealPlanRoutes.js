import { Router } from 'express';
import { getMealPlan, getShoppingList, saveMealPlan } from '../controllers/mealPlanController.js';

export const mealPlanRoutes = Router();

mealPlanRoutes.post('/', saveMealPlan);
mealPlanRoutes.get('/:week/shopping-list', getShoppingList);
mealPlanRoutes.get('/:week', getMealPlan);
