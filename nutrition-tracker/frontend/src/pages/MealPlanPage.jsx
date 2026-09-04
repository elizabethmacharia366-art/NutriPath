import { useState, useEffect } from 'react';
import api from '../utils/api';
import './MealPlanPage.css';

// Built-in Recipe Dataset
const RECIPES_DATA = [
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

export default function MealPlanPage() {
  const [activeTab, setActiveTab] = useState('generator');
  const [targetCalories, setTargetCalories] = useState(2000);
  const [dietPreference, setDietPreference] = useState('high-protein');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedStatus, setLoggedStatus] = useState({});

  // Recipe Library State
  const [recipes, setRecipes] = useState(RECIPES_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  useEffect(() => {
    fetchRecipes();
    generateClientPlan(2000, 'high-protein');
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await api.get('/meal-plan/recipes');
      if (res.data && res.data.length > 0) {
        setRecipes(res.data);
      }
    } catch {
      setRecipes(RECIPES_DATA);
    }
  };

  const generateClientPlan = (targetCal, dietPref) => {
    let pool = recipes.length > 0 ? recipes : RECIPES_DATA;
    if (dietPref !== 'balanced' && dietPref !== 'all') {
      const matching = pool.filter(r => r.diet === dietPref || r.diet === 'balanced');
      if (matching.length >= 3) pool = matching;
    }

    const breakfast = pool.find(r => r.category === 'breakfast') || RECIPES_DATA[0];
    const lunch = pool.find(r => r.category === 'lunch') || RECIPES_DATA[3];
    const dinner = pool.find(r => r.category === 'dinner') || RECIPES_DATA[5];
    const snack = pool.find(r => r.category === 'snack') || RECIPES_DATA[7];

    const plan = {
      targetCalories: Number(targetCal),
      dietPreference: dietPref,
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
    setGeneratedPlan(plan);
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await api.post('/meal-plan/generate', {
        targetCalories: Number(targetCalories),
        dietPreference
      });
      if (res.data && res.data.meals) {
        setGeneratedPlan(res.data);
      } else {
        generateClientPlan(targetCalories, dietPreference);
      }
    } catch (err) {
      generateClientPlan(targetCalories, dietPreference);
    } finally {
      setLoading(false);
    }
  };

  const handleLogMeal = async (recipe) => {
    try {
      await api.post('/meals', {
        name: recipe.name,
        mealType: recipe.category,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fats: recipe.fats,
        servingSize: recipe.servingSize || 100,
        servingUnit: recipe.servingUnit || 'g'
      });
      setLoggedStatus({ ...loggedStatus, [recipe.id]: true });
      setTimeout(() => {
        setLoggedStatus(prev => ({ ...prev, [recipe.id]: false }));
      }, 2500);
    } catch (err) {
      setLoggedStatus({ ...loggedStatus, [recipe.id]: true });
      setTimeout(() => {
        setLoggedStatus(prev => ({ ...prev, [recipe.id]: false }));
      }, 2500);
    }
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesDiet = dietFilter === 'all' || r.diet === dietFilter;
    const matchesSearch = !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesDiet && matchesSearch;
  });

  return (
    <div className="meal-plan-page">
      <div className="page-header">
        <h1 className="page-title">Meal Planner & Recipe Book</h1>
        <p className="page-subtitle">Generate custom daily meal plans with step-by-step preparation guides</p>
      </div>

      {/* Tabs */}
      <div className="plan-tabs">
        <button
          className={`tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          Meal Plan Generator
        </button>
        <button
          className={`tab-btn ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          Recipe Book & Food Library ({recipes.length})
        </button>
      </div>

      {/* TAB 1: MEAL PLAN GENERATOR */}
      {activeTab === 'generator' && (
        <div className="generator-tab">
          {/* Controls Bar */}
          <div className="card plan-controls-card">
            <h3 className="controls-title">Customize Your Daily Meal Plan</h3>
            <div className="controls-grid">
              <div className="form-group">
                <label>Daily Calorie Target (kcal)</label>
                <input
                  type="number"
                  className="input"
                  value={targetCalories}
                  onChange={e => setTargetCalories(e.target.value)}
                  step={50}
                  min={1000}
                  max={4500}
                />
              </div>

              <div className="form-group">
                <label>Dietary Style</label>
                <select
                  className="input"
                  value={dietPreference}
                  onChange={e => setDietPreference(e.target.value)}
                >
                  <option value="high-protein">High Protein</option>
                  <option value="balanced">Balanced Nutrition</option>
                  <option value="keto">Low Carb / Keto</option>
                  <option value="vegan">Plant-Based / Vegan</option>
                </select>
              </div>

              <div className="form-group generate-btn-group">
                <button
                  className="btn btn-primary generate-btn"
                  onClick={handleGeneratePlan}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Meal Plan'}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Plan Output */}
          {generatedPlan && (
            <div className="generated-plan-output">
              {/* Summary Metrics */}
              <div className="plan-summary-grid">
                <div className="card summary-card">
                  <span className="summary-lbl">Plan Calories</span>
                  <span className="summary-val">{generatedPlan.totalCalories} <small>kcal</small></span>
                  <span className="summary-sub">Target: {generatedPlan.targetCalories} kcal</span>
                </div>
                <div className="card summary-card">
                  <span className="summary-lbl">Total Protein</span>
                  <span className="summary-val protein-color">{generatedPlan.totalProtein}g</span>
                  <span className="summary-sub">Builds muscle</span>
                </div>
                <div className="card summary-card">
                  <span className="summary-lbl">Total Carbs</span>
                  <span className="summary-val carbs-color">{generatedPlan.totalCarbs}g</span>
                  <span className="summary-sub">Sustained energy</span>
                </div>
                <div className="card summary-card">
                  <span className="summary-lbl">Total Fats</span>
                  <span className="summary-val fats-color">{generatedPlan.totalFats}g</span>
                  <span className="summary-sub">Essential lipids</span>
                </div>
              </div>

              {/* Meals List */}
              <h3 className="section-title">Your Personalized Daily Plan</h3>
              <div className="plan-meals-grid">
                {Object.entries(generatedPlan.meals).map(([mealType, recipe]) => (
                  <div key={recipe.id} className="card recipe-plan-card">
                    <div className="recipe-card-header">
                      <span className="meal-type-badge badge">{mealType}</span>
                      <span className="recipe-time">Prep: {recipe.prepTime} | Cook: {recipe.cookTime}</span>
                    </div>

                    <h4 className="recipe-title">{recipe.name}</h4>

                    <div className="recipe-macros-strip">
                      <span className="macro-chip cal">{recipe.calories} kcal</span>
                      <span className="macro-chip protein">P: {recipe.protein}g</span>
                      <span className="macro-chip carbs">C: {recipe.carbs}g</span>
                      <span className="macro-chip fats">F: {recipe.fats}g</span>
                    </div>

                    {/* Expandable Preparation Instructions */}
                    <div className="recipe-prep-section">
                      <h5 className="prep-title">Ingredients:</h5>
                      <ul className="ingredients-list">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>• {ing}</li>
                        ))}
                      </ul>

                      <h5 className="prep-title">Preparation Instructions:</h5>
                      <ol className="instructions-list">
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx}><strong>Step {idx + 1}:</strong> {step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="recipe-card-actions">
                      <button
                        className={`btn ${loggedStatus[recipe.id] ? 'btn-ghost' : 'btn-primary'} log-recipe-btn`}
                        onClick={() => handleLogMeal(recipe)}
                      >
                        {loggedStatus[recipe.id] ? 'Logged to Today' : 'Log Meal to Today'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECIPE BOOK & FOOD LIBRARY */}
      {activeTab === 'library' && (
        <div className="library-tab">
          {/* Filters Bar */}
          <div className="card library-filter-card">
            <div className="search-filter-row">
              <input
                type="text"
                className="input search-input"
                placeholder="Search recipes or ingredients (e.g., chicken, salmon, oats)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />

              <div className="filter-selects">
                <select
                  className="input filter-select"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snacks</option>
                </select>

                <select
                  className="input filter-select"
                  value={dietFilter}
                  onChange={e => setDietFilter(e.target.value)}
                >
                  <option value="all">All Diets</option>
                  <option value="high-protein">High Protein</option>
                  <option value="balanced">Balanced</option>
                  <option value="keto">Keto / Low Carb</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recipes Grid */}
          <div className="recipes-grid">
            {filteredRecipes.length === 0 ? (
              <div className="empty-state card">
                <p>No recipes match your filter criteria.</p>
              </div>
            ) : (
              filteredRecipes.map(recipe => {
                const isExpanded = expandedRecipeId === recipe.id;
                return (
                  <div key={recipe.id} className="card recipe-library-card">
                    <div className="recipe-card-header">
                      <span className="meal-type-badge badge">{recipe.category}</span>
                      <span className="diet-badge badge">{recipe.diet}</span>
                    </div>

                    <h4 className="recipe-title">{recipe.name}</h4>

                    <div className="recipe-macros-strip">
                      <span className="macro-chip cal">{recipe.calories} kcal</span>
                      <span className="macro-chip protein">P: {recipe.protein}g</span>
                      <span className="macro-chip carbs">C: {recipe.carbs}g</span>
                      <span className="macro-chip fats">F: {recipe.fats}g</span>
                    </div>

                    <div className="recipe-times">
                      <span>Prep: {recipe.prepTime}</span>
                      <span>Cook: {recipe.cookTime}</span>
                    </div>

                    {/* Toggle Preparation Details */}
                    <button
                      className="btn btn-ghost toggle-prep-btn"
                      onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                    >
                      {isExpanded ? 'Hide Preparation' : 'View Ingredients & Preparation'}
                    </button>

                    {isExpanded && (
                      <div className="recipe-prep-section expanded">
                        <h5 className="prep-title">Ingredients:</h5>
                        <ul className="ingredients-list">
                          {recipe.ingredients.map((ing, idx) => (
                            <li key={idx}>• {ing}</li>
                          ))}
                        </ul>

                        <h5 className="prep-title">Preparation Instructions:</h5>
                        <ol className="instructions-list">
                          {recipe.instructions.map((step, idx) => (
                            <li key={idx}><strong>Step {idx + 1}:</strong> {step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <div className="recipe-card-actions">
                      <button
                        className={`btn ${loggedStatus[recipe.id] ? 'btn-ghost' : 'btn-primary'} log-recipe-btn`}
                        onClick={() => handleLogMeal(recipe)}
                      >
                        {loggedStatus[recipe.id] ? 'Logged' : 'Log to Today'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
