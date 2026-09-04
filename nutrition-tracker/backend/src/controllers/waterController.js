const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.logWater = async (req, res) => {
  try {
    const { amount, unit } = req.body;
    const log = await prisma.waterLog.create({
      data: { userId: req.userId, amount, unit: unit || 'L' },
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTodayWater = async (req, res) => {
  try {
    const { date } = req.query;
    const start = date ? new Date(date) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const logs = await prisma.waterLog.findMany({
      where: { userId: req.userId, loggedAt: { gte: start, lte: end } },
      orderBy: { loggedAt: 'asc' },
    });

    const total = logs.reduce((sum, l) => sum + l.amount, 0);
    res.json({ logs, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteWaterLog = async (req, res) => {
  try {
    const log = await prisma.waterLog.findUnique({ where: { id: req.params.id } });
    if (!log || log.userId !== req.userId)
      return res.status(404).json({ message: 'Log not found' });

    await prisma.waterLog.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
