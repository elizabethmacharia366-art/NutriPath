const express = require('express');
const router = express.Router();
const { logWater, getTodayWater, deleteWaterLog } = require('../controllers/waterController');
const auth = require('../middleware/auth');
router.use(auth);
router.post('/', logWater);
router.get('/', getTodayWater);
router.delete('/:id', deleteWaterLog);
module.exports = router;
