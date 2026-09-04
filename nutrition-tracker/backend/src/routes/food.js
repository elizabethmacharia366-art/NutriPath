const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&json=true&page_size=10`
    );
    const data = await response.json();
    const foods = (data.products || []).map((p) => ({
      id: p.id,
      name: p.product_name || 'Unknown',
      brand: p.brands || '',
      calories: p.nutriments?.['energy-kcal_100g'] || 0,
      protein: p.nutriments?.proteins_100g || 0,
      carbs: p.nutriments?.carbohydrates_100g || 0,
      fats: p.nutriments?.fat_100g || 0,
      servingSize: 100,
      servingUnit: 'g',
    }));
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Food search failed' });
  }
});
module.exports = router;
