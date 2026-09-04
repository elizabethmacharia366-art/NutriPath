import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try filling demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (email, password) => {
    setForm({ email, password });
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <span>🌿</span>
          <h1>NutriPath</h1>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to access your dashboard</p>

        {/* Demo Seed Shortcut Banner */}
        <div className="demo-credentials-banner">
          <div className="demo-banner-title">🔑 Quick Demo Login Credentials:</div>
          <div className="demo-banner-credentials">
            <code>demo@nutripath.com</code> / <code>password123</code>
          </div>
          <button
            type="button"
            className="btn btn-ghost demo-fill-btn"
            onClick={() => handleFillDemo('demo@nutripath.com', 'password123')}
          >
            ⚡ Auto-Fill Demo Credentials
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input className="input" type="email" placeholder="demo@nutripath.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link> | <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
