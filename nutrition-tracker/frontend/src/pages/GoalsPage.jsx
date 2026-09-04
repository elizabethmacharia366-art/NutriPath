import { useState, useEffect } from 'react';
import api from '../utils/api';
import './GoalsPage.css';

export default function GoalsPage() {
  const [form, setForm] = useState({ calories: 2000, protein: 150, carbs: 250, fats: 65, waterIntake: 2.5 });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/goals').then(r => { if (r.data) setForm(r.data); }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/goals', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    finally { setLoading(false); }
  };

  const Field = ({ label, name, unit, min, max, step = 1 }) => (
    <div className="goal-field">
      <div className="goal-field-info">
        <label>{label}</label>
        <span className="goal-unit">{unit}</span>
      </div>
      <input className="input goal-input" type="number" min={min} max={max} step={step}
        value={form[name]} onChange={e => setForm({ ...form, [name]: +e.target.value })} />
      <input type="range" min={min} max={max} step={step} value={form[name]}
        onChange={e => setForm({ ...form, [name]: +e.target.value })}
        className="goal-slider" />
    </div>
  );

  return (
    <div className="goals-page">
      <div className="page-header">
        <h1 className="page-title">Nutrition Goals</h1>
        <p className="page-subtitle">Set your daily targets</p>
      </div>

      <div className="goals-grid">
        <div className="card goals-card">
          <h3 className="section-title">Daily Calorie Goal</h3>
          <Field label="Calories" name="calories" unit="kcal" min={500} max={5000} step={50} />
        </div>

        <div className="card goals-card">
          <h3 className="section-title">Macronutrients</h3>
          <Field label="Protein" name="protein" unit="g" min={10} max={400} step={5} />
          <Field label="Carbohydrates" name="carbs" unit="g" min={10} max={600} step={5} />
          <Field label="Fats" name="fats" unit="g" min={10} max={300} step={5} />

          <div className="macro-preview">
            <div className="macro-pct">
              <div className="pct-bar" style={{ background: '#a855f7', width: `${(form.protein * 4 / form.calories * 100).toFixed(0)}%` }} />
              <span>Protein {(form.protein * 4 / form.calories * 100).toFixed(0)}%</span>
            </div>
            <div className="macro-pct">
              <div className="pct-bar" style={{ background: '#f59e0b', width: `${(form.carbs * 4 / form.calories * 100).toFixed(0)}%` }} />
              <span>Carbs {(form.carbs * 4 / form.calories * 100).toFixed(0)}%</span>
            </div>
            <div className="macro-pct">
              <div className="pct-bar" style={{ background: '#06b6d4', width: `${(form.fats * 9 / form.calories * 100).toFixed(0)}%` }} />
              <span>Fats {(form.fats * 9 / form.calories * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="card goals-card">
          <h3 className="section-title">Hydration Goal</h3>
          <Field label="Water" name="waterIntake" unit="L/day" min={0.5} max={6} step={0.25} />
        </div>
      </div>

      <div className="goals-actions">
        <button className="btn btn-primary save-btn" onClick={handleSave} disabled={loading}>
          {saved ? '✓ Saved!' : loading ? 'Saving...' : 'Save Goals'}
        </button>
      </div>
    </div>
  );
}
