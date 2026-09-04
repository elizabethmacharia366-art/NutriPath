# 🌿 NutriTrack — Diet & Nutrition Tracker

A full-stack web app built with **React + Node.js + Prisma + MongoDB**.

---

## Project Structure

```
nutrition-tracker/
├── backend/           # Node.js + Express API
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── mealController.js
│   │   │   ├── waterController.js
│   │   │   └── goalController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── meals.js
│   │   │   ├── water.js
│   │   │   ├── goals.js
│   │   │   └── food.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
└── frontend/          # React + Vite
    ├── src/
    │   ├── components/
    │   │   └── layout/
    │   │       ├── Layout.jsx
    │   │       └── Layout.css
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── MealsPage.jsx
    │   │   ├── WaterPage.jsx
    │   │   ├── GoalsPage.jsx
    │   │   └── ProgressPage.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill in your MongoDB URI and JWT secret in .env

npm install
npx prisma generate
npx prisma db push

npm run dev   # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev   # Starts on http://localhost:5173
```

---

## Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT-based signup/login |
| 🍽 Meal Logging | Log meals by type (breakfast, lunch, dinner, snack) |
| 🔍 Food Search | Search Open Food Facts database |
| 💧 Water Tracker | Log water with quick-add buttons |
| 🎯 Goals | Set calorie, macro, and hydration goals |
| 📈 Progress | 7-day charts for calories and macros |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, React Router, Recharts |
| Backend | Node.js, Express |
| ORM | Prisma |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| Food Data | Open Food Facts API |
