import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: 'demo@nutripath.com', password: 'password123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      if (form.email === 'elizabethmacharia366@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach backend server. Please ensure backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillAndLogin = async (email, password, targetPath = '/dashboard') => {
    setForm({ email, password });
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(targetPath);
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach backend server. Please ensure backend is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">
          <h1>NutriPath</h1>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to access your account</p>

        {/* Demo Seed Shortcut Banner */}
        <div className="demo-credentials-banner">
          <div className="demo-banner-title">Pre-Seeded Demo Accounts:</div>
          
          <button
            type="button"
            className="btn btn-primary demo-fill-btn"
            style={{ marginBottom: '8px' }}
            onClick={() => handleFillAndLogin('demo@nutripath.com', 'password123', '/dashboard')}
          >
            User Demo Login (demo@nutripath.com)
          </button>

          <button
            type="button"
            className="btn btn-ghost demo-fill-btn"
            onClick={() => handleFillAndLogin('elizabethmacharia366@gmail.com', 'password123', '/admin')}
          >
            Admin Portal Login (elizabethmacharia366@gmail.com)
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
