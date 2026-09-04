import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../utils/api';
import './ProgressPage.css';

export default function ProgressPage() {
  const [stats, setStats] = useState([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fats: 65 });

  useEffect(() => {
    api.get('/meals/stats/weekly').then(r => setStats(r.data)).catch(() => {});
    api.get('/goals').then(r => { if (r.data) setGoals(r.data); }).catch(() => {});
  }, []);

  const formatted = stats.map(s => ({
    ...s,
    date: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    calories: Math.round(s.calories),
    protein: Math.round(s.protein),
    carbs: Math.round(s.carbs),
    fats: Math.round(s.fats),
  }));

  const avg = formatted.length ? {
    calories: Math.round(formatted.reduce((s, d) => s + d.calories, 0) / formatted.length),
    protein: Math.round(formatted.reduce((s, d) => s + d.protein, 0) / formatted.length),
    carbs: Math.round(formatted.reduce((s, d) => s + d.carbs, 0) / formatted.length),
    fats: Math.round(formatted.reduce((s, d) => s + d.fats, 0) / formatted.length),
  } : { calories: 0, protein: 0, carbs: 0, fats: 0 };

  const tooltipStyle = {
    background: '#120e1a',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#f8fafc',
    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
  };

  return (
    <div className="progress-page">
      <div className="page-header">
        <h1 className="page-title">Progress</h1>
        <p className="page-subtitle">7-day nutrition overview</p>
      </div>

      <div className="avg-cards">
        {[
          { label: 'Avg Calories', val: avg.calories, unit: 'kcal', goal: goals.calories },
          { label: 'Avg Protein', val: avg.protein, unit: 'g', goal: goals.protein },
          { label: 'Avg Carbs', val: avg.carbs, unit: 'g', goal: goals.carbs },
          { label: 'Avg Fats', val: avg.fats, unit: 'g', goal: goals.fats },
        ].map(item => (
          <div key={item.label} className="card avg-card">
            <span className="avg-label">{item.label}</span>
            <span className="avg-val">{item.val}<span className="avg-unit">{item.unit}</span></span>
            <span className="avg-goal">Goal: {item.goal}{item.unit}</span>
          </div>
        ))}
      </div>

      <div className="card chart-card">
        <h3 className="chart-title">Calories (7 days)</h3>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={formatted} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a78bfa' }} />
            <YAxis tick={{ fontSize: 11, fill: '#a78bfa' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="calories" fill="#a855f7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card chart-card">
        <h3 className="chart-title">Macros (7 days)</h3>
        <ResponsiveContainer width="100%" height={230}>
          <LineChart data={formatted} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a78bfa' }} />
            <YAxis tick={{ fontSize: 11, fill: '#a78bfa' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#a78bfa' }} />
            <Line type="monotone" dataKey="protein" stroke="#a855f7" strokeWidth={2.5} dot={{ fill: '#a855f7', r: 4 }} />
            <Line type="monotone" dataKey="carbs" stroke="#ec4899" strokeWidth={2.5} dot={{ fill: '#ec4899', r: 4 }} />
            <Line type="monotone" dataKey="fats" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
