const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getGoals = async (req, res) => {
  try {
    const goals = await prisma.goal.findUnique({ where: { userId: req.userId } });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGoals = async (req, res) => {
  try {
    const { calories, protein, carbs, fats, waterIntake } = req.body;
    const goals = await prisma.goal.upsert({
      where: { userId: req.userId },
      update: { calories, protein, carbs, fats, waterIntake },
      create: { userId: req.userId, calories, protein, carbs, fats, waterIntake },
    });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
