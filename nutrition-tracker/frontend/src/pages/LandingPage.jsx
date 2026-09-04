import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

export default function LandingPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (email, password) => {
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page">
      {/* Top Navbar */}
      <header className="landing-header">
        <div className="landing-nav-container">
          <div className="landing-logo">
            <span className="logo-text">NutriPath</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#demo-accounts" className="nav-link">Demo Accounts</a>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            Precision Health & Nutrition Tracker
          </div>
          <h1 className="hero-title">
            Empower Your Body with <span className="highlight-text">Smart Nutrition</span>
          </h1>
          <p className="hero-subtitle">
            Track daily calories, log macronutrients, monitor hydration levels, and explore thousands of live food items with real-time analytics.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn btn-primary hero-btn-main"
              onClick={() => handleDemoLogin('demo@nutripath.com', 'password123')}
            >
              Quick Demo Login
            </button>
            <Link to="/register" className="btn btn-ghost hero-btn-sec">
              Create Account
            </Link>
          </div>

          {/* Seed Credentials Quick Box */}
          <div id="demo-accounts" className="seed-box card">
            <div className="seed-header">
              <div>
                <h3 className="seed-title">Pre-Seeded Demo Credentials</h3>
                <p className="seed-desc">Use any of the seeded accounts below for instant testing access:</p>
              </div>
            </div>

            <div className="seed-credentials-grid">
              <div className="seed-card">
                <div className="seed-card-info">
                  <span className="seed-role">Primary Demo User</span>
                  <span className="seed-email">demo@nutripath.com</span>
                  <span className="seed-pass">Password: <code>password123</code></span>
                </div>
                <button
                  className="btn btn-primary seed-btn"
                  onClick={() => handleDemoLogin('demo@nutripath.com', 'password123')}
                >
                  Log In
                </button>
              </div>

              <div className="seed-card">
                <div className="seed-card-info">
                  <span className="seed-role">Elizabeth Admin Account</span>
                  <span className="seed-email">elizabethmacharia366@gmail.com</span>
                  <span className="seed-pass">Password: <code>password123</code></span>
                </div>
                <button
                  className="btn btn-ghost seed-btn"
                  onClick={() => handleDemoLogin('elizabethmacharia366@gmail.com', 'password123')}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="features-main-title">Designed for Ultimate Wellness</h2>
            <p className="features-main-sub">Comprehensive tracking tools wrapped in a high-contrast obsidian black theme.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card card">
              <h3 className="feature-name">Food Database Search</h3>
              <p className="feature-desc">Integrated with Open Food Facts API to instantly query thousands of global groceries and recipes.</p>
            </div>

            <div className="feature-card card">
              <h3 className="feature-name">Hydration Tracker</h3>
              <p className="feature-desc">Interactive liquid gauge with quick-add buttons to ensure daily water targets are consistently met.</p>
            </div>

            <div className="feature-card card">
              <h3 className="feature-name">Macronutrient Goals</h3>
              <p className="feature-desc">Customizable target splits for Protein, Carbohydrates, and Fats with visual balance previews.</p>
            </div>

            <div className="feature-card card">
              <h3 className="feature-name">7-Day Progress Analytics</h3>
              <p className="feature-desc">Interactive weekly charts showcasing calorie trends and macro distributions over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} NutriPath. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
