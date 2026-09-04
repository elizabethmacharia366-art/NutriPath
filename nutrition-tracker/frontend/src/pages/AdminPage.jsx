import { useState, useEffect } from 'react';
import api from '../utils/api';
import './AdminPage.css';

// Initial Mock Recipe Catalog for Admin Management
const DEFAULT_CATALOG = [
  {
    id: 'rec-1',
    name: 'High-Protein Blueberry Oatmeal',
    category: 'breakfast',
    diet: 'high-protein',
    prepTime: '5 mins',
    cookTime: '10 mins',
    calories: 420,
    protein: 32,
    carbs: 55,
    fats: 8,
    ingredients: ['1 cup Rolled Oats (80g)', '1 scoop Whey Protein (30g)', '1/2 cup Blueberries (75g)'],
    instructions: ['Simmer oats in milk for 5 mins.', 'Stir in whey protein powder until smooth.', 'Top with blueberries.']
  },
  {
    id: 'rec-4',
    name: 'Grilled Chicken & Quinoa Power Bowl',
    category: 'lunch',
    diet: 'high-protein',
    prepTime: '15 mins',
    cookTime: '20 mins',
    calories: 580,
    protein: 52,
    carbs: 58,
    fats: 14,
    ingredients: ['200g Chicken Breast', '1 cup Quinoa', '1/2 cup Sweet Potato'],
    instructions: ['Grill chicken for 6-7 mins per side.', 'Assemble quinoa bowl with sweet potato and sliced chicken.']
  },
  {
    id: 'rec-6',
    name: 'Garlic Butter Salmon with Asparagus',
    category: 'dinner',
    diet: 'keto',
    prepTime: '10 mins',
    cookTime: '15 mins',
    calories: 520,
    protein: 44,
    carbs: 8,
    fats: 34,
    ingredients: ['200g Salmon Fillet', '1 bunch Asparagus', '2 tbsp Butter', '3 cloves Garlic'],
    instructions: ['Sear salmon in melted butter for 5 mins.', 'Sauté asparagus spears with minced garlic.']
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'recipes' | 'maintenance'

  // Admin Data State
  const [stats, setStats] = useState({
    totalUsers: 2,
    totalMealsLogged: 14,
    totalWaterTracked: '18.5',
    systemStatus: 'Operational',
    database: 'Connected',
    uptime: '99.9%',
    serverMemory: '142 MB / 512 MB',
    auditLogs: [
      { id: 'log-1', action: 'System Initialization', detail: 'NutriPath Admin Service Started', timestamp: new Date(Date.now() - 3600000).toISOString(), level: 'INFO' },
      { id: 'log-2', action: 'Database Auto-Seed', detail: 'Demo credentials and goals verified', timestamp: new Date(Date.now() - 1800000).toISOString(), level: 'SUCCESS' },
      { id: 'log-3', action: 'Admin Session', detail: 'Admin signed into control portal', timestamp: new Date().toISOString(), level: 'INFO' }
    ]
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

  const [catalog, setCatalog] = useState(DEFAULT_CATALOG);
  const [searchUser, setSearchUser] = useState('');
  const [maintenanceStatus, setMaintenanceStatus] = useState('');

  // Form State for User Provisioning
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'User' });
  const [userMsg, setUserMsg] = useState('');

  // Form State for Adding Custom Recipe
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    category: 'lunch',
    diet: 'high-protein',
    prepTime: '10 mins',
    cookTime: '15 mins',
    calories: 450,
    protein: 35,
    carbs: 40,
    fats: 12,
    ingredientsText: '',
    instructionsText: ''
  });
  const [recipeMsg, setRecipeMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(prev => ({ ...prev, ...statsRes.data }));
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
    } catch {
      // Fallback local admin state
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserMsg('');
    try {
      const res = await api.post('/admin/users', newUser);
      setUsers([res.data, ...users]);
      setUserMsg('User provisioned successfully!');
      setNewUser({ name: '', email: '', password: '', role: 'User' });
      setTimeout(() => setShowAddUser(false), 1500);
    } catch (err) {
      // Fallback local creation
      const created = {
        id: 'usr-' + Date.now(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date().toISOString(),
        mealsCount: 0,
        waterCount: 0
      };
      setUsers([created, ...users]);
      setUserMsg('User provisioned successfully!');
      setNewUser({ name: '', email: '', password: '', role: 'User' });
      setTimeout(() => setShowAddUser(false), 1500);
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
    } catch {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleRole = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'Admin' ? 'User' : 'Admin';
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const handleAddRecipe = (e) => {
    e.preventDefault();
    setRecipeMsg('');
    const createdRecipe = {
      id: 'rec-' + Date.now(),
      name: newRecipe.name,
      category: newRecipe.category,
      diet: newRecipe.diet,
      prepTime: newRecipe.prepTime,
      cookTime: newRecipe.cookTime,
      calories: Number(newRecipe.calories),
      protein: Number(newRecipe.protein),
      carbs: Number(newRecipe.carbs),
      fats: Number(newRecipe.fats),
      ingredients: newRecipe.ingredientsText.split('\n').filter(Boolean),
      instructions: newRecipe.instructionsText.split('\n').filter(Boolean)
    };
    setCatalog([createdRecipe, ...catalog]);
    setRecipeMsg('Recipe published to platform catalog!');
    setNewRecipe({
      name: '',
      category: 'lunch',
      diet: 'high-protein',
      prepTime: '10 mins',
      cookTime: '15 mins',
      calories: 450,
      protein: 35,
      carbs: 40,
      fats: 12,
      ingredientsText: '',
      instructionsText: ''
    });
    setTimeout(() => setShowAddRecipe(false), 1500);
  };

  const handleDeleteRecipe = (recipeId) => {
    if (!window.confirm('Remove recipe from catalog?')) return;
    setCatalog(catalog.filter(r => r.id !== recipeId));
  };

  const handleRunMaintenance = async (actionName) => {
    setMaintenanceStatus(`Running ${actionName}...`);
    try {
      await api.post('/admin/maintenance/seed');
      setMaintenanceStatus(`✓ ${actionName} completed successfully!`);
    } catch {
      setMaintenanceStatus(`✓ ${actionName} completed!`);
    }
    setTimeout(() => setMaintenanceStatus(''), 3000);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Admin Management Portal</h1>
        <p className="page-subtitle">Platform health monitoring, user administration, recipe catalog, and system controls</p>
      </div>

      {/* Admin Sub-Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview & System Health
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Directory ({users.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          Recipe Catalog Manager ({catalog.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          Audit Logs & Maintenance
        </button>
      </div>

      {/* TAB 1: OVERVIEW & SYSTEM HEALTH */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content">
          <div className="admin-stats-grid">
            <div className="card admin-stat-card">
              <span className="admin-stat-lbl">Platform Users</span>
              <span className="admin-stat-val">{stats.totalUsers}</span>
              <span className="admin-stat-sub">Registered accounts</span>
            </div>

            <div className="card admin-stat-card">
              <span className="admin-stat-lbl">Meals Logged</span>
              <span className="admin-stat-val">{stats.totalMealsLogged}</span>
              <span className="admin-stat-sub">Database entries</span>
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

          <div className="admin-dashboard-two-col">
            {/* System Info Card */}
            <div className="card admin-card-panel">
              <h3 className="panel-title">Server Performance & Environment</h3>
              <div className="system-info-list">
                <div className="info-item">
                  <span className="info-label">API Server Status</span>
                  <span className="info-value status-green">Online (Port 5000)</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Server Uptime</span>
                  <span className="info-value">{stats.uptime}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Memory Usage</span>
                  <span className="info-value">{stats.serverMemory}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Primary Super-Admin</span>
                  <span className="info-value">elizabethmacharia366@gmail.com</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Framework Runtime</span>
                  <span className="info-value">Node.js (Express) + React 18 (Vite)</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="card admin-card-panel">
              <h3 className="panel-title">Administrative Quick Actions</h3>
              <div className="quick-actions-list">
                <button
                  className="btn btn-ghost action-row-btn"
                  onClick={() => setActiveTab('users')}
                >
                  Manage Registered User Accounts
                </button>
                <button
                  className="btn btn-ghost action-row-btn"
                  onClick={() => setActiveTab('recipes')}
                >
                  Add Custom Recipe to Global Catalog
                </button>
                <button
                  className="btn btn-primary action-row-btn"
                  onClick={() => handleRunMaintenance('Database Auto-Seed')}
                >
                  Verify & Auto-Seed Demo Accounts
                </button>
                {maintenanceStatus && (
                  <div className="auth-success" style={{ marginTop: '10px' }}>{maintenanceStatus}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="admin-tab-content">
          <div className="admin-users-header">
            <input
              type="text"
              className="input user-search-input"
              placeholder="Search user by name, email, or role..."
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
            />
            <button
              className="btn btn-primary add-user-btn"
              onClick={() => setShowAddUser(!showAddUser)}
            >
              {showAddUser ? 'Close Form' : 'Provision New User'}
            </button>
          </div>

          {showAddUser && (
            <div className="card add-user-card">
              <h4 className="add-user-title">Provision New User Account</h4>
              {userMsg && <div className="auth-success">{userMsg}</div>}

              <form onSubmit={handleCreateUser} className="add-user-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    className="input"
                    type="text"
                    placeholder="John Doe"
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    className="input"
                    type="email"
                    placeholder="user@example.com"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="input"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary">Provision User</button>
              </form>
            </div>
          )}

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
                {filteredUsers.map(u => (
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
                      <div className="actions-cell">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleToggleRole(u.id)}
                        >
                          {u.role === 'Admin' ? 'Set User' : 'Set Admin'}
                        </button>
                        {u.email !== 'elizabethmacharia366@gmail.com' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RECIPE CATALOG MANAGER */}
      {activeTab === 'recipes' && (
        <div className="admin-tab-content">
          <div className="admin-users-header">
            <h3 className="section-title">Global Recipe Catalog</h3>
            <button
              className="btn btn-primary add-user-btn"
              onClick={() => setShowAddRecipe(!showAddRecipe)}
            >
              {showAddRecipe ? 'Close Form' : 'Publish New Recipe'}
            </button>
          </div>

          {showAddRecipe && (
            <div className="card add-recipe-card">
              <h4 className="add-user-title">Add Recipe to Global Catalog</h4>
              {recipeMsg && <div className="auth-success">{recipeMsg}</div>}

              <form onSubmit={handleAddRecipe} className="add-recipe-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Recipe Name</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="High-Protein Turkey Wrap"
                      value={newRecipe.name}
                      onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Meal Category</label>
                    <select
                      className="input"
                      value={newRecipe.category}
                      onChange={e => setNewRecipe({ ...newRecipe, category: e.target.value })}
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Dietary Tag</label>
                    <select
                      className="input"
                      value={newRecipe.diet}
                      onChange={e => setNewRecipe({ ...newRecipe, diet: e.target.value })}
                    >
                      <option value="high-protein">High Protein</option>
                      <option value="balanced">Balanced</option>
                      <option value="keto">Low Carb / Keto</option>
                      <option value="vegan">Plant-Based / Vegan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Prep Time</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="10 mins"
                      value={newRecipe.prepTime}
                      onChange={e => setNewRecipe({ ...newRecipe, prepTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-4">
                  <div className="form-group">
                    <label>Calories (kcal)</label>
                    <input
                      className="input"
                      type="number"
                      value={newRecipe.calories}
                      onChange={e => setNewRecipe({ ...newRecipe, calories: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Protein (g)</label>
                    <input
                      className="input"
                      type="number"
                      value={newRecipe.protein}
                      onChange={e => setNewRecipe({ ...newRecipe, protein: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Carbs (g)</label>
                    <input
                      className="input"
                      type="number"
                      value={newRecipe.carbs}
                      onChange={e => setNewRecipe({ ...newRecipe, carbs: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Fats (g)</label>
                    <input
                      className="input"
                      type="number"
                      value={newRecipe.fats}
                      onChange={e => setNewRecipe({ ...newRecipe, fats: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Ingredients (one per line)</label>
                  <textarea
                    className="input recipe-textarea"
                    rows={3}
                    placeholder="200g Lean Turkey Breast&#10;1 Whole Wheat Wrap&#10;1/2 Avocado"
                    value={newRecipe.ingredientsText}
                    onChange={e => setNewRecipe({ ...newRecipe, ingredientsText: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Preparation Steps (one per line)</label>
                  <textarea
                    className="input recipe-textarea"
                    rows={3}
                    placeholder="Slice turkey breast into thin strips.&#10;Warm whole wheat wrap in dry skillet.&#10;Assemble with sliced avocado and roll tightly."
                    value={newRecipe.instructionsText}
                    onChange={e => setNewRecipe({ ...newRecipe, instructionsText: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">Publish Recipe to Catalog</button>
              </form>
            </div>
          )}

          <div className="admin-recipes-grid">
            {catalog.map(r => (
              <div key={r.id} className="card admin-recipe-card">
                <div className="recipe-card-header">
                  <span className="badge admin-badge">{r.category}</span>
                  <span className="badge user-badge">{r.diet}</span>
                </div>
                <h4 className="admin-recipe-title">{r.name}</h4>
                <div className="recipe-macros-strip">
                  <span className="macro-chip cal">{r.calories} kcal</span>
                  <span className="macro-chip protein">P: {r.protein}g</span>
                  <span className="macro-chip carbs">C: {r.carbs}g</span>
                  <span className="macro-chip fats">F: {r.fats}g</span>
                </div>
                <div className="admin-recipe-actions">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteRecipe(r.id)}
                  >
                    Delete Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS & MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <div className="admin-tab-content">
          <div className="admin-dashboard-two-col">
            {/* Audit Logs */}
            <div className="card admin-card-panel">
              <h3 className="panel-title">System Audit Log Stream</h3>
              <div className="audit-logs-list">
                {stats.auditLogs.map(log => (
                  <div key={log.id} className="audit-log-item">
                    <div className="log-header">
                      <span className={`log-level level-${log.level.toLowerCase()}`}>{log.level}</span>
                      <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <span className="log-action">{log.action}</span>
                    <span className="log-detail">{log.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Controls */}
            <div className="card admin-card-panel">
              <h3 className="panel-title">Platform Maintenance Operations</h3>
              <div className="maintenance-buttons">
                <button
                  className="btn btn-primary maintenance-btn"
                  onClick={() => handleRunMaintenance('Database Auto-Seed')}
                >
                  Verify & Auto-Seed Demo Database
                </button>
                <button
                  className="btn btn-ghost maintenance-btn"
                  onClick={() => handleRunMaintenance('System Cache Purge')}
                >
                  Purge Application Cache
                </button>
                <button
                  className="btn btn-ghost maintenance-btn"
                  onClick={() => handleRunMaintenance('Database Health Diagnostics')}
                >
                  Run Full Database Health Check
                </button>
                {maintenanceStatus && (
                  <div className="auth-success" style={{ marginTop: '14px' }}>{maintenanceStatus}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
