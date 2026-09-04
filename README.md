# NutriPath — Modern Diet & Health Management Platform

A production-ready full-stack web application designed for comprehensive nutrition tracking, personalized meal plan generation, recipe preparation guides, hydration monitoring, and weekly analytics.

Built with **React (Vite) + Node.js (Express) + Prisma + SQLite/MongoDB**. Styled with an ultra-sleek **Obsidian Black & Electric Purple** design system and global italic typography.

---

## Key Features

- **Public Landing Page**: Accessible root landing page featuring hero section, platform highlights, feature previews, and direct 1-click demo access.
- **Personalized Meal Plan Generator**: Instant algorithm that generates tailored daily meal plans (Breakfast, Lunch, Dinner, Snack) based on target calories and dietary preferences (High Protein, Balanced, Low Carb/Keto, Plant-Based/Vegan).
- **Recipe Book & Preparation Guides**: Extensive recipe catalog complete with exact ingredients, step-by-step cooking directions, preparation times, and 1-click meal logging.
- **Meal & Food Search**: Query thousands of grocery items and meals powered by the Open Food Facts API, with granular macro breakdowns (Protein, Carbs, Fats).
- **Hydration Tracker**: Interactive liquid volume gauge with quick-add buttons and daily target tracking.
- **Macronutrient Goals**: Customizable daily goals for calories, protein, carbohydrates, fats, and water intake with visual split indicators.
- **7-Day Progress Analytics**: Interactive weekly bar and line charts powered by Recharts for calorie trends and macro distributions.
- **Pre-Seeded Demo Access**: Instant 1-click demo authentication with pre-seeded demo accounts (`demo@nutripath.com` and `elizabethmacharia366@gmail.com`).

---

## Design System & Theme

- **Color Palette**: Obsidian Black (`#08060d`) paired with Electric Neon Purple (`#a855f7`) and Royal Violet (`#7e22ce`).
- **Typography**: Inter with global italic font-style across all UI components for a modern, sleek appearance.
- **Surfaces**: Dark glassmorphism cards with glowing purple accents and subtle borders.

---

## Pre-Seeded Demo Credentials

| Role | Email | Password |
|---|---|---|
| Primary Demo User | `demo@nutripath.com` | `password123` |
| Admin Account | `elizabethmacharia366@gmail.com` | `password123` |

---

## Project Structure

```text
NutriPath/
├── vercel.json                 # Vercel deployment configuration
├── nutrition-tracker/
│   ├── backend/                # Node.js + Express REST API
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema (User, Goal, Meal, WaterLog)
│   │   ├── src/
│   │   │   ├── controllers/    # Request handlers (auth, meal, water, goals)
│   │   │   ├── middleware/     # Auth JWT verification middleware
│   │   │   ├── routes/         # Express routes (auth, meals, mealPlan, water, goals, food)
│   │   │   └── index.js        # Server entrypoint & auto-seeding
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── frontend/               # React + Vite Single Page Application
│       ├── src/
│       │   ├── components/
│       │   │   └── layout/
│       │   │       ├── Layout.jsx
│       │   │       └── Layout.css
│       │   ├── context/
│       │   │   └── AuthContext.jsx
│       │   ├── pages/
│       │   │   ├── LandingPage.jsx
│       │   │   ├── LoginPage.jsx
│       │   │   ├── RegisterPage.jsx
│       │   │   ├── DashboardPage.jsx
│       │   │   ├── MealsPage.jsx
│       │   │   ├── MealPlanPage.jsx
│       │   │   ├── WaterPage.jsx
│       │   │   ├── GoalsPage.jsx
│       │   │   └── ProgressPage.jsx
│       │   ├── utils/
│       │   │   └── api.js
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── index.css
│       ├── index.html
│       ├── vite.config.js
│       └── package.json
```

---

## Setup & Local Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Backend Setup

```bash
cd nutrition-tracker/backend

# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Generate Prisma client and sync database schema
npx prisma generate
npx prisma db push

# Start backend server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd nutrition-tracker/frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user account | No |
| POST | `/api/auth/login` | Authenticate user & get JWT | No |
| GET | `/api/auth/me` | Fetch authenticated user profile | Yes |
| GET | `/api/meals` | Retrieve logged meals by date | Yes |
| POST | `/api/meals` | Log a new meal item | Yes |
| DELETE | `/api/meals/:id` | Delete a logged meal item | Yes |
| GET | `/api/meals/stats/weekly` | Fetch 7-day nutrition summary stats | Yes |
| GET | `/api/meal-plan/recipes` | List recipe catalog with prep guides | Yes |
| POST | `/api/meal-plan/generate` | Generate personalized meal plan | Yes |
| GET | `/api/water` | Fetch water logs for date | Yes |
| POST | `/api/water` | Log water consumption | Yes |
| DELETE | `/api/water/:id` | Delete a water log entry | Yes |
| GET | `/api/goals` | Fetch user nutrition goals | Yes |
| PUT | `/api/goals` | Update user nutrition goals | Yes |
| GET | `/api/food/search` | Search Open Food Facts database | Yes |

---

## Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Recharts, Axios
- **Backend**: Node.js, Express, JSON Web Token (JWT), bcryptjs
- **Database & ORM**: Prisma ORM, SQLite / MongoDB
- **Styling**: Custom CSS variables, Glassmorphism, Responsive CSS Grid/Flexbox
- **Deployment**: Vercel ready (`vercel.json`)

---

## License & Author

Created by **Elizabeth Macharia**. Distributed under the MIT License.
