const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meals');
const waterRoutes = require('./routes/water');
const goalRoutes = require('./routes/goals');
const foodRoutes = require('./routes/food');

const prisma = new PrismaClient();
const app = express();

// Auto-seed Demo & Admin Users
async function autoSeed() {
  try {
    const hashed = await bcrypt.hash('password123', 10);
    
    // Seed 1: Demo User
    let demoUser = await prisma.user.findUnique({ where: { email: 'demo@nutripath.com' } });
    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@nutripath.com',
          password: hashed,
        }
      });
      await prisma.goal.create({
        data: {
          userId: demoUser.id,
          calories: 2200,
          protein: 160,
          carbs: 240,
          fats: 60,
          waterIntake: 3.0
        }
      });

      // Sample Meals for Demo User
      await prisma.meal.createMany({
        data: [
          { userId: demoUser.id, name: 'Oatmeal with Blueberries & Honey', mealType: 'breakfast', calories: 380, protein: 12, carbs: 65, fats: 8, servingSize: 250 },
          { userId: demoUser.id, name: 'Grilled Chicken Breast with Brown Rice', mealType: 'lunch', calories: 550, protein: 48, carbs: 52, fats: 10, servingSize: 350 },
          { userId: demoUser.id, name: 'Whey Protein Shake', mealType: 'snack', calories: 180, protein: 25, carbs: 6, fats: 3, servingSize: 300 },
        ]
      });

      // Sample Water Log
      await prisma.waterLog.createMany({
        data: [
          { userId: demoUser.id, amount: 0.5 },
          { userId: demoUser.id, amount: 0.75 },
          { userId: demoUser.id, amount: 0.5 },
        ]
      });
      console.log('🌱 Pre-seeded demo@nutripath.com user successfully!');
    }

    // Seed 2: Elizabeth Admin User
    let adminUser = await prisma.user.findUnique({ where: { email: 'elizabethmacharia366@gmail.com' } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: 'Elizabeth Macharia',
          email: 'elizabethmacharia366@gmail.com',
          password: hashed,
        }
      });
      await prisma.goal.create({
        data: {
          userId: adminUser.id,
          calories: 2000,
          protein: 150,
          carbs: 250,
          fats: 65,
          waterIntake: 2.5
        }
      });
      console.log('🌱 Pre-seeded elizabethmacharia366@gmail.com user successfully!');
    }
  } catch (err) {
    console.error('Auto-seed notice:', err.message);
  }
}

autoSeed();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/food', foodRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', seeded: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 NutriPath Server running on port ${PORT}`));
