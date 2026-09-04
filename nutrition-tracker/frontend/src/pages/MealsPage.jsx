import { useState, useEffect } from 'react';
import api from '../utils/api';
import './MealsPage.css';

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

export default function MealsPage() {
  const [meals, setMeals] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ mealType: 'BREAKFAST', servingSize: 100 });
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = () => {
    api.get(`/meals?date=${today}`).then(r => setMeals(r.data)).catch(() => {});
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    setSearching(true);
    try {
      const { data } = await api.get(`/food/search?q=${encodeURIComponent(searchQ)}`);
      setSearchResults(data);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  };

  const selectFood = (food) => {
    setSelected(food);
    setForm(f => ({ ...f, servingSize: food.servingSize || 100 }));
    setSearchResults([]);
    setSearchQ('');
  };

  const logMeal = async () => {
    if (!selected) return;
    const ratio = form.servingSize / (selected.servingSize || 100);
    setLoading(true);
    try {
      await api.post('/meals', {
        name: selected.name,
        mealType: form.mealType,
        calories: selected.calories * ratio,
        protein: selected.protein * ratio,
        carbs: selected.carbs * ratio,
        fats: selected.fats * ratio,
        servingSize: form.servingSize,
        servingUnit: selected.servingUnit || 'g',
      });
      setSelected(null);
      fetchMeals();
    } catch {}
    finally { setLoading(false); }
  };

  const deleteMeal = async (id) => {
    await api.delete(`/meals/${id}`);
    fetchMeals();
  };

  const grouped = MEAL_TYPES.reduce((acc, type) => {
    acc[type] = meals.filter(m => m.mealType === type);
    return acc;
  }, {});

  return (
    <div className="meals-page">
      <div className="page-header">
        <h1 className="page-title">Meals</h1>
        <p className="page-subtitle">Log and track your daily food intake</p>
      </div>

      <div className="meals-layout">
        {}
        <div className="log-panel">
          <div className="card log-card">
            <h3 className="section-title">Log Food</h3>

            <form onSubmit={handleSearch} className="search-form">
              <input className="input" placeholder="Search food database..." value={searchQ}
                onChange={e => setSearchQ(e.target.value)} />
              <button className="btn btn-primary" type="submit" disabled={searching}>
                {searching ? '...' : 'Search'}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(f => (
                  <div key={f.id} className="search-result" onClick={() => selectFood(f)}>
                    <div className="result-info">
                      <span className="result-name">{f.name}</span>
                      {f.brand && <span className="result-brand">{f.brand}</span>}
                    </div>
                    <span className="result-cal">{Math.round(f.calories)} kcal/100g</span>
                  </div>
                ))}
              </div>
            )}

            {selected && (
              <div className="selected-food">
                <div className="selected-header">
                  <div>
                    <div className="selected-name">{selected.name}</div>
                    <div className="selected-macros">
                      <span>P: {Math.round(selected.protein * form.servingSize / 100)}g</span>
                      <span>C: {Math.round(selected.carbs * form.servingSize / 100)}g</span>
                      <span>F: {Math.round(selected.fats * form.servingSize / 100)}g</span>
                    </div>
                  </div>
                  <button className="clear-btn" onClick={() => setSelected(null)}>✕</button>
                </div>

                <div className="log-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Meal type</label>
                      <select className="input" value={form.mealType}
                        onChange={e => setForm({ ...form, mealType: e.target.value })}>
                        {MEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Serving (g)</label>
                      <input className="input" type="number" min="1" value={form.servingSize}
                        onChange={e => setForm({ ...form, servingSize: +e.target.value })} />
                    </div>
                  </div>
                  <div className="cal-preview">
                    {Math.round(selected.calories * form.servingSize / 100)} kcal
                  </div>
                  <button className="btn btn-primary log-btn" onClick={logMeal} disabled={loading}>
                    {loading ? 'Logging...' : 'Add to log'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="today-panel">
          {MEAL_TYPES.map(type => (
            <div key={type} className="card meal-group">
              <div className="meal-group-header">
                <h4 className="meal-group-title">{type}</h4>
                <span className="meal-group-cal">
                  {Math.round(grouped[type].reduce((s, m) => s + m.calories, 0))} kcal
                </span>
              </div>
              {grouped[type].length === 0 ? (
                <p className="meal-empty">No {type.toLowerCase()} logged</p>
              ) : (
                <div className="meal-items">
                  {grouped[type].map(m => (
                    <div key={m.id} className="meal-item">
                      <div className="meal-item-info">
                        <span className="meal-item-name">{m.name}</span>
                        <span className="meal-item-detail">{m.servingSize}{m.servingUnit} · P:{Math.round(m.protein)}g C:{Math.round(m.carbs)}g F:{Math.round(m.fats)}g</span>
                      </div>
                      <div className="meal-item-right">
                        <span className="meal-item-cal">{Math.round(m.calories)}</span>
                        <button className="del-btn" onClick={() => deleteMeal(m.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
