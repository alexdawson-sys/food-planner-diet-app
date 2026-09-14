# Food Planner Diet App

A mobile-first food planner and diet tracking app for personal weight loss support. This repository now includes:

- **`mobile/`** — Expo + React Native + TypeScript app with a professional multi-tab experience
- **`web/`** — React + Vite web fallback with Tailwind CSS styling
- **`backend/`** — Express + MongoDB API with JWT authentication and diet-tracking endpoints
- **`docker-compose.yml`** — local MongoDB + backend startup for development
- **`.env.example`** — environment variables for secure configuration

## Core product coverage

The current implementation covers the requested feature areas with a clean mobile-first UI and matching backend structure:

- Email registration/login and profile setup with automatic TDEE-based target calculation
- Weight logging, weight history, progress stats, and projected goal date
- Daily meal logging for breakfast/lunch/dinner/snacks with food search and custom foods
- Calories/macros dashboard with progress bars and remaining targets
- Food and recipe data models, favorites, and custom food support
- Weekly meal planning, presets, reusable templates, and copy-forward planning affordances
- Auto-generated shopping lists with categories, costs, and checklist state
- Progress analytics, achievements, and summary cards
- Settings for goals, reminders, theme, units, and backup/restore affordances
- Mobile-first touches for widgets, barcode logging, push reminders, and offline-sync messaging

## Repository structure

```text
food-planner-diet-app/
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── services/
│   │   └── utils/
│   ├── App.tsx
│   ├── app.json
│   └── package.json
├── web/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Backend API

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh-token`

### Users
- `GET /users/profile`
- `PUT /users/profile`
- `PUT /users/goals`

### Weight Tracking
- `POST /weight`
- `GET /weight/history`
- `GET /weight/stats`

### Meals
- `POST /meals`
- `GET /meals/today`
- `PUT /meals/:id`
- `DELETE /meals/:id`

### Foods
- `GET /foods/search`
- `POST /foods/custom`
- `GET /foods/favorites`

### Recipes
- `POST /recipes`
- `GET /recipes`
- `GET /recipes/:id`
- `DELETE /recipes/:id`

### Meal Plans
- `POST /meal-plans`
- `GET /meal-plans/:week`
- `GET /meal-plans/:week/shopping-list`

### Analytics
- `GET /analytics/daily`
- `GET /analytics/weekly`
- `GET /analytics/monthly`

## Setup

### 1. Install dependencies

```bash
npm install
npm --prefix mobile install
npm --prefix web install
npm --prefix backend install
```

### 2. Configure environment

Copy `.env.example` to `.env` or `backend/.env` and supply secure values:

```bash
cp .env.example backend/.env
```

Required variables:

```env
MONGO_URI=mongodb://localhost:27017/food-planner
JWT_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-second-long-random-secret
PORT=4000
CLIENT_URL=http://localhost:5173
```

### 3. Start the backend and MongoDB

```bash
docker compose up mongo backend
```

Or run the API directly:

```bash
npm run backend:start
```

### 4. Start the mobile app

```bash
npm run mobile
```

### 5. Start the web fallback

```bash
npm run web
```

## Mobile UI notes

The Expo app provides a bottom-tab experience with dedicated surfaces for:

- **Home** — nutrition dashboard and quick actions
- **Planner** — daily meal planning, food search, weekly presets, and shopping preview
- **Progress** — weight trend chart, summary stats, and milestones
- **Shop** — categorized grocery checklist with estimated costs
- **Settings** — goals, reminders, theme, units, backup/restore, and mobile-specific affordances

## Security and reliability

The Express API includes:

- JWT-protected user routes
- bcrypt password hashing
- Helmet headers
- rate limiting
- Mongo query sanitization
- environment-based secrets

## Validation used for this change

- `npm --prefix backend start`
- `npm --prefix web run build`
- `npx expo export --platform web` (from `mobile/`)
- `npm audit` review on the Expo scaffold

## Deployment notes

- **Mobile**: publish the Expo app for iOS/Android
- **Web**: deploy the Vite build output from `web/dist`
- **Backend**: run the Express app with MongoDB and the environment variables above

If you want the next iteration to connect the mobile and web clients directly to the live backend rather than the included demo state, the `services` and API layers are already structured for that expansion.
