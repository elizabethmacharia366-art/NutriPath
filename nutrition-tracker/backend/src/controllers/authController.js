const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || 'nutritrack-super-secret-jwt-2024', { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const cleanEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: name.trim(), email: cleanEmail, password: hashed },
    });

    await prisma.goal.create({ data: { userId: user.id } });

    const token = generateToken(user.id);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    let user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    // On-demand auto-creation for Demo & Admin accounts if missing in database
    if (!user && (cleanEmail === 'demo@nutripath.com' || cleanEmail === 'elizabethmacharia366@gmail.com') && password === 'password123') {
      const hashed = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          name: cleanEmail === 'demo@nutripath.com' ? 'Demo User' : 'Elizabeth Macharia',
          email: cleanEmail,
          password: hashed,
          goals: {
            create: {
              calories: 2000,
              protein: 150,
              carbs: 250,
              fats: 65,
              waterIntake: 2.5
            }
          }
        }
      });
    }

    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
