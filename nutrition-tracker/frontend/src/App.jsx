import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MealsPage from './pages/MealsPage';
import WaterPage from './pages/WaterPage';
import GoalsPage from './pages/GoalsPage';
import ProgressPage from './pages/ProgressPage';
import Layout from './components/layout/Layout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-2)', fontStyle: 'italic' }}>
      Loading NutriPath...
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Application Dashboard Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
          </Route>

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="meals" element={<MealsPage />} />
            <Route path="water" element={<WaterPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="progress" element={<ProgressPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
