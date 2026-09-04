import { useState, useEffect } from 'react';
import api from '../utils/api';
import './AdminPage.css';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 2,
    totalMealsLogged: 14,
    totalWaterTracked: '18.5',
    systemStatus: 'Operational',
    database: 'Connected'
  });
  const [users, setUsers] = useState([
    {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@nutripath.com',
      role: 'User',
      createdAt: new Date().toISOString(),
      mealsCount: 8,
      waterCount: 5
    },
    {
      id: 'admin-user-456',
      name: 'Elizabeth Macharia',
      email: 'elizabethmacharia366@gmail.com',
      role: 'Admin',
      createdAt: new Date().toISOString(),
      mealsCount: 12,
      waterCount: 9
    }
  ]);
  const [loading, setLoading] = useState(false);

  // New User Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
    } catch (err) {
      console.warn('Using local admin fallback data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      const res = await api.post('/admin/users', newForm);
      setUsers([res.data, ...users]);
      setFormSuccess('User account created successfully!');
      setNewForm({ name: '', email: '', password: '' });
      setTimeout(() => setShowAddForm(false), 1500);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (email === 'elizabethmacharia366@gmail.com') {
      alert('Cannot delete super-admin account!');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Admin Management Portal</h1>
        <p className="page-subtitle">System-wide monitoring, user accounts, and platform administration</p>
      </div>

      {/* Overview Metric Cards */}
      <div className="admin-stats-grid">
        <div className="card admin-stat-card">
          <span className="admin-stat-lbl">Platform Users</span>
          <span className="admin-stat-val">{stats.totalUsers}</span>
          <span className="admin-stat-sub">Active accounts</span>
        </div>

        <div className="card admin-stat-card">
          <span className="admin-stat-lbl">Meals Logged</span>
          <span className="admin-stat-val">{stats.totalMealsLogged}</span>
          <span className="admin-stat-sub">Total database entries</span>
        </div>

        <div className="card admin-stat-card">
          <span className="admin-stat-lbl">Water Tracked</span>
          <span className="admin-stat-val">{stats.totalWaterTracked}<small>L</small></span>
          <span className="admin-stat-sub">Cumulative volume</span>
        </div>

        <div className="card admin-stat-card">
          <span className="admin-stat-lbl">System Health</span>
          <span className="admin-stat-val status-green">{stats.systemStatus}</span>
          <span className="admin-stat-sub">Database: {stats.database}</span>
        </div>
      </div>

      {/* User Directory Section */}
      <div className="admin-users-header">
        <h3 className="section-title">User Accounts Directory ({users.length})</h3>
        <button
          className="btn btn-primary add-user-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Close Form' : 'Provision New User'}
        </button>
      </div>

      {/* Add User Form Modal */}
      {showAddForm && (
        <div className="card add-user-card">
          <h4 className="add-user-title">Provision New User Account</h4>
          {formError && <div className="auth-error">{formError}</div>}
          {formSuccess && <div className="auth-success">{formSuccess}</div>}

          <form onSubmit={handleCreateUser} className="add-user-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="input"
                type="text"
                placeholder="John Doe"
                value={newForm.name}
                onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="user@example.com"
                value={newForm.email}
                onChange={e => setNewForm({ ...newForm, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={newForm.password}
                onChange={e => setNewForm({ ...newForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">Create User Account</button>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="card users-table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Meals Logged</th>
              <th>Water Logged</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="user-name-cell">{u.name}</td>
                <td className="user-email-cell">{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'Admin' ? 'admin-badge' : 'user-badge'}`}>
                    {u.role}
                  </span>
                </td>
                <td>{u.mealsCount || 0}</td>
                <td>{u.waterCount || 0}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u.email !== 'elizabethmacharia366@gmail.com' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(u.id, u.email)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
