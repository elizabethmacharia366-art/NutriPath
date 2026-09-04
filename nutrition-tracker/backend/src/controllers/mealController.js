const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.logMeal = async (req, res) => {
  try {
    const { name, mealType, calories, protein, carbs, fats, servingSize, servingUnit, loggedAt } = req.body;
    const meal = await prisma.meal.create({
      data: {
        userId: req.userId,
        name,
        mealType,
        calories,
        protein: protein || 0,
        carbs: carbs || 0,
        fats: fats || 0,
        servingSize: servingSize || 100,
        servingUnit: servingUnit || 'g',
        loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
      },
    });
    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMeals = async (req, res) => {
  try {
    const { date } = req.query;
    const start = date ? new Date(date) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const meals = await prisma.meal.findMany({
      where: { userId: req.userId, loggedAt: { gte: start, lte: end } },
      orderBy: { loggedAt: 'asc' },
    });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const meal = await prisma.meal.findUnique({ where: { id: req.params.id } });
    if (!meal || meal.userId !== req.userId)
      return res.status(404).json({ message: 'Meal not found' });

    await prisma.meal.delete({ where: { id: req.params.id } });
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getWeeklyStats = async (req, res) => {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const meals = await prisma.meal.findMany({
      where: { userId: req.userId, loggedAt: { gte: start, lte: end } },
    });

    const stats = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().split('T')[0];
      stats[key] = { date: key, calories: 0, protein: 0, carbs: 0, fats: 0 };
    }

    meals.forEach((m) => {
      const key = m.loggedAt.toISOString().split('T')[0];
      if (stats[key]) {
        stats[key].calories += m.calories;
        stats[key].protein += m.protein;
        stats[key].carbs += m.carbs;
        stats[key].fats += m.fats;
      }
    });

    res.json(Object.values(stats));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
