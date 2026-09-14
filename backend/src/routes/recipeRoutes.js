import { Router } from 'express';
import { createRecipe, deleteRecipe, getRecipe, getRecipes } from '../controllers/recipeController.js';

export const recipeRoutes = Router();

recipeRoutes.post('/', createRecipe);
recipeRoutes.get('/', getRecipes);
recipeRoutes.get('/:id', getRecipe);
recipeRoutes.delete('/:id', deleteRecipe);
