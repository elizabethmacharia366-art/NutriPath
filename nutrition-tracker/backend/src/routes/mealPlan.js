const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Comprehensive Recipe Library with Prep Instructions & Macros
const recipes = [
  {
    id: 'rec-1',
    name: 'High-Protein Blueberry Oatmeal',
    category: 'breakfast',
    diet: 'high-protein',
    prepTime: '5 mins',
    cookTime: '10 mins',
    calories: 420,
    protein: 32,
    carbs: 55,
    fats: 8,
    servingSize: 350,
    servingUnit: 'g',
    ingredients: [
      '1 cup Rolled Oats (80g)',
      '1 scoop Whey Protein Powder (30g)',
      '1/2 cup Fresh Blueberries (75g)',
      '1 cup Unsweetened Almond Milk (240ml)',
      '1 tbsp Chia Seeds (12g)',
      '1 tsp Pure Honey (7g)'
    ],
    instructions: [
      'In a small saucepan, bring almond milk to a gentle simmer over medium heat.',
      'Add rolled oats and chia seeds; cook for 5 minutes stirring frequently until creamy.',
      'Remove from heat and stir in the whey protein powder until smooth.',
      'Fold in fresh blueberries and drizzle honey over the top before serving warm.'
    ]
  },
  {
    id: 'rec-2',
    name: 'Avocado & Poached Egg Whole Wheat Toast',
    category: 'breakfast',
    diet: 'balanced',
    prepTime: '5 mins',
    cookTime: '8 mins',
    calories: 380,
    protein: 18,
    carbs: 34,
    fats: 20,
    servingSize: 220,
    servingUnit: 'g',
    ingredients: [
      '2 slices Whole Wheat Sourdough Bread',
      '1 Medium Ripe Avocado (100g)',
      '2 Large Eggs',
      '1 tsp Extra Virgin Olive Oil',
      'Pinch of Red Pepper Flakes & Sea Salt'
    ],
    instructions: [
      'Toast sourdough slices to desired golden crispiness.',
      'Mash avocado in a bowl with a pinch of sea salt and lemon juice.',
      'Bring a pot of water with a dash of white vinegar to a gentle simmer; poach eggs for 3 minutes.',
      'Spread avocado over toasts, top each with a poached egg, and garnish with red pepper flakes.'
    ]
  },
  {
    id: 'rec-3',
    name: 'Spinach & Mushroom Tofu Scramble',
    category: 'breakfast',
    diet: 'vegan',
    prepTime: '10 mins',
    cookTime: '10 mins',
    calories: 320,
    protein: 24,
    carbs: 16,
    fats: 18,
    servingSize: 300,
    servingUnit: 'g',
    ingredients: [
      '200g Firm Tofu (drained and crumbled)',
      '1 cup Baby Spinach (30g)',
      '1/2 cup Sliced Button Mushrooms (50g)',
      '1 tbsp Nutritional Yeast',
      '1/2 tsp Turmeric & Garlic Powder',
      '1 tsp Olive Oil'
    ],
    instructions: [
      'Heat olive oil in a non-stick skillet over medium-high heat.',
      'Add sliced mushrooms and cook for 4 minutes until golden.',
      'Add crumbled tofu, turmeric, garlic powder, and nutritional yeast; stir fry for 5 minutes.',
      'Toss in fresh baby spinach until wilted. Season with black salt & pepper.'
    ]
  },
  {
    id: 'rec-4',
    name: 'Grilled Chicken & Quinoa Power Bowl',
    category: 'lunch',
    diet: 'high-protein',
    prepTime: '15 mins',
    cookTime: '20 mins',
    calories: 580,
    protein: 52,
    carbs: 58,
    fats: 14,
    servingSize: 450,
    servingUnit: 'g',
    ingredients: [
      '200g Skinless Chicken Breast',
      '1 cup Cooked Quinoa (185g)',
      '1/2 cup Roasted Sweet Potato Cubes (100g)',
      '1/2 cup Steamed Broccoli florets (80g)',
      '1 tbsp Tahini Dressing'
    ],
    instructions: [
      'Season chicken breast with paprika, garlic, oregano, salt, and black pepper.',
      'Grill chicken breast for 6–7 minutes per side until internal temperature reaches 165°F (74°C).',
      'Assemble bowl by placing cooked quinoa as base, topped with sweet potatoes, broccoli, and sliced grilled chicken.',
      'Drizzle with creamy tahini dressing.'
    ]
  },
  {
    id: 'rec-5',
    name: 'Mediterranean Chickpea & Cucumber Salad',
    category: 'lunch',
    diet: 'vegan',
    prepTime: '12 mins',
    cookTime: '0 mins',
    calories: 410,
    protein: 16,
    carbs: 54,
    fats: 15,
    servingSize: 350,
    servingUnit: 'g',
    ingredients: [
      '1 can Chickpeas (rinsed and drained, 240g)',
      '1 English Cucumber (diced)',
      '1 cup Cherry Tomatoes (halved)',
      '1/4 cup Red Onion (finely diced)',
      '1 tbsp Extra Virgin Olive Oil & Lemon Juice',
      '1/4 cup Fresh Parsley (chopped)'
    ],
    instructions: [
      'Combine drained chickpeas, cucumber, cherry tomatoes, and red onion in a large bowl.',
      'Whisk olive oil, fresh lemon juice, oregano, salt, and pepper in a small jar.',
      'Pour dressing over salad, toss gently with chopped parsley, and chill for 10 minutes before serving.'
    ]
  },
  {
    id: 'rec-6',
    name: 'Garlic Butter Salmon with Asparagus',
    category: 'dinner',
    diet: 'keto',
    prepTime: '10 mins',
    cookTime: '15 mins',
    calories: 520,
    protein: 44,
    carbs: 8,
    fats: 34,
    servingSize: 320,
    servingUnit: 'g',
    ingredients: [
      '200g Wild Salmon Fillet',
      '1 bunch Fresh Asparagus (150g, trimmed)',
      '2 tbsp Grass-fed Butter',
      '3 cloves Garlic (minced)',
      '1 tbsp Fresh Lemon Juice & Parsley'
    ],
    instructions: [
      'Melt 1 tbsp butter in a large skillet over medium-high heat.',
      'Place salmon skin-side down; sear for 5 minutes, flip and cook for another 3 minutes.',
      'Push salmon to the side; add remaining butter, minced garlic, and asparagus spears to skillet.',
      'Sauté asparagus for 5 minutes until crisp-tender. Spoon garlic butter sauce over salmon.'
    ]
  },
  {
    id: 'rec-7',
    name: 'Lean Beef & Broccoli Stir-Fry',
    category: 'dinner',
    diet: 'high-protein',
    prepTime: '15 mins',
    cookTime: '12 mins',
    calories: 510,
    protein: 48,
    carbs: 32,
    fats: 18,
    servingSize: 400,
    servingUnit: 'g',
    ingredients: [
      '200g Lean Flank Steak (thinly sliced)',
      '2 cups Broccoli Florets (150g)',
      '1/2 Jasmine Rice (cooked, 100g)',
      '2 tbsp Tamari / Low Sodium Soy Sauce',
      '1 tsp Sesame Oil & Ginger'
    ],
    instructions: [
      'Marinate beef slices in soy sauce, minced ginger, and cornstarch for 10 minutes.',
      'Heat sesame oil in a wok or skillet over high heat; sear beef for 3 minutes until browned.',
      'Add broccoli florets and 2 tbsp water; cover and steam for 3 minutes.',
      'Toss beef and broccoli in stir-fry sauce and serve hot over jasmine rice.'
    ]
  },
  {
    id: 'rec-8',
    name: 'Greek Yogurt Parfait with Honey & Nuts',
    category: 'snack',
    diet: 'balanced',
    prepTime: '5 mins',
    cookTime: '0 mins',
    calories: 260,
    protein: 22,
    carbs: 24,
    fats: 9,
    servingSize: 250,
    servingUnit: 'g',
    ingredients: [
      '200g Plain Non-Fat Greek Yogurt',
      '1 tbsp Raw Honey (15g)',
      '15g Crushed Walnuts & Almonds',
      '1/4 cup Fresh Raspberries'
    ],
    instructions: [
      'Spoon Greek yogurt into a glass bowl or jar.',
      'Layer fresh raspberries and chopped mixed nuts on top.',
      'Drizzle with raw honey immediately before serving.'
    ]
  }
];

// GET /api/meal-plan/recipes - Get recipe library
router.get('/recipes', auth, (req, res) => {
  const { category, diet, search } = req.query;
  let filtered = [...recipes];

  if (category && category !== 'all') {
    filtered = filtered.filter(r => r.category === category);
  }
  if (diet && diet !== 'all') {
    filtered = filtered.filter(r => r.diet === diet);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => r.name.toLowerCase().includes(q) || r.ingredients.some(i => i.toLowerCase().includes(q)));
  }

  res.json(filtered);
});

// POST /api/meal-plan/generate - Generate personalized daily meal plan
router.post('/generate', auth, (req, res) => {
  const { targetCalories = 2000, dietPreference = 'balanced' } = req.body;

  let pool = recipes;
  if (dietPreference !== 'balanced' && dietPreference !== 'all') {
    pool = recipes.filter(r => r.diet === dietPreference || r.diet === 'balanced');
    if (pool.length < 3) pool = recipes;
  }

  const breakfast = pool.find(r => r.category === 'breakfast') || recipes[0];
  const lunch = pool.find(r => r.category === 'lunch') || recipes[3];
  const dinner = pool.find(r => r.category === 'dinner') || recipes[5];
  const snack = pool.find(r => r.category === 'snack') || recipes[7];

  const plan = {
    targetCalories,
    dietPreference,
    totalCalories: breakfast.calories + lunch.calories + dinner.calories + snack.calories,
    totalProtein: breakfast.protein + lunch.protein + dinner.protein + snack.protein,
    totalCarbs: breakfast.carbs + lunch.carbs + dinner.carbs + snack.carbs,
    totalFats: breakfast.fats + lunch.fats + dinner.fats + snack.fats,
    meals: {
      breakfast,
      lunch,
      dinner,
      snack
    }
  };

  res.json(plan);
});

module.exports = router;
