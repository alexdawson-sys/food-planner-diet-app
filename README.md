# Food Planner & Diet App

A full-stack food planner and diet tracking application with JWT auth, meal planning, nutrition tracking, recipes, shopping lists, and progress monitoring.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT

## Project Structure

```text
food-planner-diet-app/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Core Features Implemented

1. **User Management**
   - Register/login endpoints
   - JWT-protected routes
   - Profile setup (height, weight, age, gender, activity level, goal)
   - Auto calorie/macro target calculation

2. **Meal Planning**
   - Daily meal plan by date
   - Add meals for breakfast/lunch/dinner/snacks
   - Weekly template create/list/apply API

3. **Nutritional Tracking**
   - Daily intake aggregation
   - Macro and micronutrient tracking
   - Intake vs target comparison in dashboard/tracking UI

4. **Recipe & Food Database**
   - Food model/search/create API
   - Recipe model/search/create API
   - Favorite recipes support

5. **Shopping Lists**
   - Manual list creation
   - Auto-generate list from meal plans
   - Toggle purchased items

6. **Progress Tracking**
   - Weight entry logging
   - Weekly/monthly summary reports

7. **UI/UX**
   - Professional responsive layout with Tailwind CSS
   - Dashboard and navigation for all core modules

## Setup

### 1) Start MongoDB

```bash
docker compose up -d
```

### 2) Configure environment

Copy `.env.example` values into your own environment.

For backend, set at minimum:
- `MONGODB_URI`
- `JWT_SECRET`

For frontend:
- `VITE_API_URL` (defaults to `http://localhost:5000/api`)

### 3) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4) Run the app

Terminal 1:
```bash
cd backend
npm run dev
```

Terminal 2:
```bash
cd frontend
npm run dev
```

Frontend default URL: `http://localhost:5173`

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/PUT /api/users/profile`
- `GET/POST /api/foods`
- `GET/POST /api/recipes`
- `GET /api/recipes/favorites`
- `POST/DELETE /api/recipes/:id/favorite`
- `GET /api/meal-plans/:date`
- `POST /api/meal-plans/meal`
- `GET /api/meal-plans/templates/all`
- `POST /api/meal-plans/templates`
- `POST /api/meal-plans/templates/apply`
- `GET /api/tracking/daily?date=YYYY-MM-DD`
- `GET/POST /api/shopping-lists`
- `POST /api/shopping-lists/generate`
- `PATCH /api/shopping-lists/:listId/items/:itemId/toggle`
- `GET/POST /api/progress`
- `GET /api/progress/report/summary?period=weekly|monthly`
