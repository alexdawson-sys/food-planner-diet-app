const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path: string, method = 'GET', token?: string, body?: unknown) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  register: (payload: unknown) => request('/auth/register', 'POST', undefined, payload),
  login: (payload: unknown) => request('/auth/login', 'POST', undefined, payload),
  getProfile: (token: string) => request('/users/profile', 'GET', token),
  updateProfile: (token: string, payload: unknown) => request('/users/profile', 'PUT', token, payload),
  getDailySummary: (token: string, date: string) => request(`/tracking/daily?date=${date}`, 'GET', token),
  getMealPlan: (token: string, date: string) => request(`/meal-plans/${date}`, 'GET', token),
  addMeal: (token: string, payload: unknown) => request('/meal-plans/meal', 'POST', token, payload),
  listRecipes: (token: string, search = '') => request(`/recipes?search=${encodeURIComponent(search)}`, 'GET', token),
  createRecipe: (token: string, payload: unknown) => request('/recipes', 'POST', token, payload),
  favoriteRecipe: (token: string, recipeId: string) => request(`/recipes/${recipeId}/favorite`, 'POST', token),
  getFavorites: (token: string) => request('/recipes/favorites', 'GET', token),
  listShoppingLists: (token: string) => request('/shopping-lists', 'GET', token),
  createShoppingList: (token: string, payload: unknown) => request('/shopping-lists', 'POST', token, payload),
  generateShoppingList: (token: string, payload: unknown) => request('/shopping-lists/generate', 'POST', token, payload),
  toggleShoppingItem: (token: string, listId: string, itemId: string) =>
    request(`/shopping-lists/${listId}/items/${itemId}/toggle`, 'PATCH', token),
  listProgress: (token: string) => request('/progress', 'GET', token),
  addProgress: (token: string, payload: unknown) => request('/progress', 'POST', token, payload),
  progressReport: (token: string, period: 'weekly' | 'monthly') => request(`/progress/report/summary?period=${period}`, 'GET', token),
}
