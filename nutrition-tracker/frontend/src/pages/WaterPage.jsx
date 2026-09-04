import { useState, useEffect } from 'react';
import api from '../utils/api';
import './WaterPage.css';

const QUICK_AMOUNTS = [0.25, 0.33, 0.5, 1.0];

export default function WaterPage() {
  const [water, setWater] = useState({ logs: [], total: 0 });
  const [goals, setGoals] = useState({ waterIntake: 2.5 });
  const [custom, setCustom] = useState('');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchWater();
    api.get('/goals').then(r => { if (r.data) setGoals(r.data); }).catch(() => {});
  }, []);

  const fetchWater = () => {
    api.get(`/water?date=${today}`).then(r => setWater(r.data)).catch(() => {});
  };

  const logWater = async (amount) => {
    await api.post('/water', { amount, unit: 'L' });
    fetchWater();
  };

  const deleteLog = async (id) => {
    await api.delete(`/water/${id}`);
    fetchWater();
  };

  const pct = Math.min((water.total / goals.waterIntake) * 100, 100);

  return (
    <div className="water-page">
      <div className="page-header">
        <h1 className="page-title">Water Intake</h1>
        <p className="page-subtitle">Stay hydrated throughout the day</p>
      </div>

      <div className="water-layout">
        <div className="card water-main-card">
          <div className="big-glass-wrap">
            <div className="big-glass">
              <div className="big-fill" style={{ height: `${pct}%` }}>
                <div className="water-ripple" />
              </div>
              <div className="glass-text">
                <span className="glass-amount">{water.total.toFixed(2)}L</span>
                <span className="glass-goal">of {goals.waterIntake}L</span>
              </div>
            </div>
            <div className="pct-label">{Math.round(pct)}% complete</div>
          </div>

          <div className="quick-add">
            <p className="quick-label">Quick add</p>
            <div className="quick-btns">
              {QUICK_AMOUNTS.map(a => (
                <button key={a} className="quick-btn" onClick={() => logWater(a)}>
                  +{a}L
                </button>
              ))}
            </div>
          </div>

          <div className="custom-add">
            <input className="input" type="number" step="0.05" min="0.05" placeholder="Custom amount (L)"
              value={custom} onChange={e => setCustom(e.target.value)} />
            <button className="btn btn-primary" onClick={() => { if (custom) { logWater(+custom); setCustom(''); } }}>
              Add
            </button>
          </div>
        </div>

        <div className="card water-log-card">
          <h3 className="section-title">Today's Log</h3>
          {water.logs.length === 0 ? (
            <div className="empty-state">
              <span>💧</span>
              <p>No water logged yet</p>
            </div>
          ) : (
            <div className="water-logs">
              {water.logs.map(log => (
                <div key={log.id} className="water-log-item">
                  <div className="log-icon">💧</div>
                  <div className="log-info">
                    <span className="log-amount">{log.amount}L</span>
                    <span className="log-time">{new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <button className="del-btn" onClick={() => deleteLog(log.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
