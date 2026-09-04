import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './DashboardPage.css';

const MacroBar = ({ label, current, goal, color }) => {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div className="macro-bar">
      <div className="macro-bar-header">
        <span className="macro-label">{label}</span>
        <span className="macro-values">{Math.round(current)}g <span>/ {goal}g</span></span>
      </div>
      <div className="macro-track">
        <div className="macro-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [water, setWater] = useState({ total: 0 });
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fats: 65, waterIntake: 2.5 });
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get(`/meals?date=${today}`).then(r => setMeals(r.data)).catch(() => {});
    api.get(`/water?date=${today}`).then(r => setWater(r.data)).catch(() => {});
    api.get('/goals').then(r => { if (r.data) setGoals(r.data); }).catch(() => {});
  }, []);

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fats: acc.fats + m.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const calPct = Math.min((totals.calories / goals.calories) * 100, 100);
  const waterPct = Math.min((water.total / goals.waterIntake) * 100, 100);
  const remaining = Math.max(goals.calories - totals.calories, 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">{greeting()}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="dash-grid">
        {}
        <div className="card cal-card">
          <h3 className="card-title">Today's Calories</h3>
          <div className="cal-ring-wrap">
            <svg viewBox="0 0 100 100" className="cal-ring">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface-2)" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--accent)" strokeWidth="8"
                strokeDasharray={`${calPct * 2.513} 251.3`}
                strokeLinecap="round" transform="rotate(-90 50 50)" />
            </svg>
            <div className="cal-ring-center">
              <span className="cal-number">{Math.round(totals.calories)}</span>
              <span className="cal-label">kcal</span>
            </div>
          </div>
          <div className="cal-stats">
            <div className="cal-stat">
              <span className="stat-val">{goals.calories}</span>
              <span className="stat-lbl">Goal</span>
            </div>
            <div className="cal-stat-divider" />
            <div className="cal-stat">
              <span className="stat-val">{Math.round(remaining)}</span>
              <span className="stat-lbl">Remaining</span>
            </div>
            <div className="cal-stat-divider" />
            <div className="cal-stat">
              <span className="stat-val">{meals.length}</span>
              <span className="stat-lbl">Meals</span>
            </div>
          </div>
        </div>

        {/* Macros */}
        <div className="card macros-card">
          <h3 className="card-title">Macronutrients</h3>
          <div className="macros-list">
            <MacroBar label="Protein" current={totals.protein} goal={goals.protein} color="#3d6b4f" />
            <MacroBar label="Carbs" current={totals.carbs} goal={goals.carbs} color="#c47d20" />
            <MacroBar label="Fats" current={totals.fats} goal={goals.fats} color="#2f6890" />
          </div>
        </div>

        {/* Water */}
        <div className="card water-card">
          <h3 className="card-title">Water Intake</h3>
          <div className="water-visual">
            <div className="water-glass">
              <div className="water-fill" style={{ height: `${waterPct}%` }} />
              <span className="water-pct">{Math.round(waterPct)}%</span>
            </div>
          </div>
          <div className="water-info">
            <span className="water-current">{water.total.toFixed(1)}L</span>
            <span className="water-goal">of {goals.waterIntake}L goal</span>
          </div>
        </div>

        {/* Recent meals */}
        <div className="card recent-card">
          <h3 className="card-title">Recent Meals</h3>
          {meals.length === 0 ? (
            <div className="empty-state">
              <span>🍽</span>
              <p>No meals logged today</p>
            </div>
          ) : (
            <div className="recent-meals">
              {meals.slice(-5).reverse().map(m => (
                <div key={m.id} className="recent-meal">
                  <div className="recent-meal-info">
                    <span className="recent-meal-name">{m.name}</span>
                    <span className="recent-meal-type badge">{m.mealType}</span>
                  </div>
                  <span className="recent-meal-cal">{Math.round(m.calories)} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
