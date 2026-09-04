import { useState, useEffect } from 'react';
import api from '../utils/api';
import './MealPlanPage.css';

export default function MealPlanPage() {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'library'
  const [targetCalories, setTargetCalories] = useState(2000);
  const [dietPreference, setDietPreference] = useState('high-protein');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedStatus, setLoggedStatus] = useState({});

  // Recipe Library State
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  useEffect(() => {
    fetchRecipes();
    handleGeneratePlan();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await api.get('/meal-plan/recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error('Failed to load recipes', err);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const res = await api.post('/meal-plan/generate', {
        targetCalories: Number(targetCalories),
        dietPreference
      });
      setGeneratedPlan(res.data);
    } catch (err) {
      console.error('Failed to generate plan', err);
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
      console.error('Failed to log meal', err);
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
          ✨ AI Meal Plan Generator
        </button>
        <button
          className={`tab-btn ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          📖 Recipe Book & Food Library ({recipes.length})
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
                  <option value="high-protein">🏋️‍♂️ High Protein</option>
                  <option value="balanced">🥑 Balanced Nutrition</option>
                  <option value="keto">🥩 Low Carb / Keto</option>
                  <option value="vegan">🌿 Plant-Based / Vegan</option>
                </select>
              </div>

              <div className="form-group generate-btn-group">
                <button
                  className="btn btn-primary generate-btn"
                  onClick={handleGeneratePlan}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : '⚡ Generate Meal Plan'}
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
                  <summary-sub className="summary-sub">Essential lipids</summary-sub>
                </div>
              </div>

              {/* Meals List */}
              <h3 className="section-title">Your Personalized Daily Plan</h3>
              <div className="plan-meals-grid">
                {Object.entries(generatedPlan.meals).map(([mealType, recipe]) => (
                  <div key={recipe.id} className="card recipe-plan-card">
                    <div className="recipe-card-header">
                      <span className="meal-type-badge badge">{mealType}</span>
                      <span className="recipe-time">⏱ Prep: {recipe.prepTime} | Cook: {recipe.cookTime}</span>
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
                      <h5 className="prep-title">🛒 Ingredients:</h5>
                      <ul className="ingredients-list">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>• {ing}</li>
                        ))}
                      </ul>

                      <h5 className="prep-title">👨‍🍳 Preparation Instructions:</h5>
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
                        {loggedStatus[recipe.id] ? '✓ Logged to Today!' : '➕ Log Meal to Today'}
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
                placeholder="🔍 Search recipes or ingredients (e.g., chicken, salmon, oats)..."
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
                <span>🔍</span>
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
                      <span>⏱ Prep: {recipe.prepTime}</span>
                      <span>🔥 Cook: {recipe.cookTime}</span>
                    </div>

                    {/* Toggle Preparation Details */}
                    <button
                      className="btn btn-ghost toggle-prep-btn"
                      onClick={() => setExpandedRecipeId(isExpanded ? null : recipe.id)}
                    >
                      {isExpanded ? '▲ Hide Preparation' : '▼ View Ingredients & Preparation'}
                    </button>

                    {isExpanded && (
                      <div className="recipe-prep-section expanded">
                        <h5 className="prep-title">🛒 Ingredients:</h5>
                        <ul className="ingredients-list">
                          {recipe.ingredients.map((ing, idx) => (
                            <li key={idx}>• {ing}</li>
                          ))}
                        </ul>

                        <h5 className="prep-title">👨‍🍳 Preparation Instructions:</h5>
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
                        {loggedStatus[recipe.id] ? '✓ Logged!' : '➕ Log to Today'}
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
