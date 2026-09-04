const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Admin middleware check
const adminOnly = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || (user.email !== 'elizabethmacharia366@gmail.com' && !user.email.includes('admin'))) {
      return res.status(403).json({ message: 'Access denied: Admin privileges required.' });
    }
    next();
  } catch {
    res.status(500).json({ message: 'Authorization check failed' });
  }
};

// GET /api/admin/stats - System Overview Metrics
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const mealCount = await prisma.meal.count();
    const waterLogs = await prisma.waterLog.findMany();
    const totalWater = waterLogs.reduce((acc, w) => acc + w.amount, 0);

    res.json({
      totalUsers: userCount,
      totalMealsLogged: mealCount,
      totalWaterTracked: totalWater.toFixed(1),
      systemStatus: 'Operational',
      database: 'Connected'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

// GET /api/admin/users - List all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { meals: true, water: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = users.map(u => ({
      ...u,
      role: u.email === 'elizabethmacharia366@gmail.com' ? 'Admin' : 'User',
      mealsCount: u._count.meals,
      waterCount: u._count.water
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// POST /api/admin/users - Create user from admin portal
router.post('/users', auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const cleanEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: name.trim(), email: cleanEmail, password: hashed }
    });
    await prisma.goal.create({ data: { userId: user.id } });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: 'User' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// DELETE /api/admin/users/:id - Remove user account
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
