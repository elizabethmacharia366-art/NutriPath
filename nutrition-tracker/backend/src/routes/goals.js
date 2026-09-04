const express = require('express');
const router = express.Router();
const { getGoals, updateGoals } = require('../controllers/goalController');
const auth = require('../middleware/auth');
router.use(auth);
router.get('/', getGoals);
router.put('/', updateGoals);
module.exports = router;
