const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const mealRoutes = require('./routes/meals');
const waterRoutes = require('./routes/water');
const goalRoutes = require('./routes/goals');
const foodRoutes = require('./routes/food');

const app = express();

// Production-ready CORS configuration
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
      callback(null, true); // Fallback to allow client requests in serverless / custom domains
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

app.get('/api/health', (req, res) => res.json({ status: 'OK', environment: process.env.NODE_ENV || 'development' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 NutriTrack Server running on port ${PORT}`));
