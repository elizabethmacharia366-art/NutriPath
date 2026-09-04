# NutriPath — Diet & Nutrition Tracker

A production-ready full-stack web application built with **React (Vite) + Node.js (Express) + Prisma + SQLite/MongoDB**.

---

## Features

- **Public Landing Page**: Accessible root page featuring hero presentation and pre-seeded demo accounts.
- **Personalized Meal Plan Generator**: Customized meal plans (Breakfast, Lunch, Dinner, Snack) tailored to target calories and dietary preferences (High Protein, Balanced, Low Carb/Keto, Plant-Based/Vegan).
- **Recipe Book & Preparation Guides**: Detailed recipe directory with ingredients, step-by-step cooking instructions, preparation times, and 1-click meal logging.
- **Food Search**: Search thousands of items via Open Food Facts database integration.
- **Hydration Tracker**: Interactive liquid volume gauge with quick-add buttons.
- **Goals Management**: Set custom calorie, macronutrient (Protein, Carbs, Fats), and water targets.
- **7-Day Progress Analytics**: Weekly bar and line charts showcasing calorie trends and macro splits.
- **Pre-Seeded Demo Access**: Instant 1-click demo login for `demo@nutripath.com` and `elizabethmacharia366@gmail.com`.

---

## Pre-Seeded Demo Credentials

| Role | Email | Password |
|---|---|---|
| Primary Demo User | `demo@nutripath.com` | `password123` |
| Admin Account | `elizabethmacharia366@gmail.com` | `password123` |

---

## Setup & Running Locally

### 1. Backend

```bash
cd backend
cp .env.example .env

npm install
npx prisma generate
npx prisma db push

npm run dev   # Starts API server on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev   # Starts Vite server on http://localhost:5173
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Recharts |
| Backend | Node.js, Express |
| ORM | Prisma |
| Database | SQLite / MongoDB Atlas |
| Authentication | JWT + bcryptjs |
| Food API | Open Food Facts API |
