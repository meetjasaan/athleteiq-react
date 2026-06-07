import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import AdminPortal from './components/SuperAdmin/AdminPortal';
import RegisterWithToken from './components/InviteToClaim/RegisterWithToken';
import PlayerDashboard from './components/PlayerPortal/PlayerDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-clinical">
        <p className="font-mono text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Login Component
const LoginPage = () => {
  const { login } = useAuth();
  const [role, setRole] = React.useState('director');
  const [email, setEmail] = React.useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: email || `${role}@athleteiq.com`,
      name: role === 'super_admin' ? 'Administrator' : 'Demo User',
      role,
      mfaVerified: true,
      loginTime: new Date().toISOString(),
    };

    login(mockUser);
  };

  return (
    <div className="min-h-screen bg-clinical pt-20 pb-10 px-4">
      <div className="max-w-md w-full mx-auto bg-white border border-borderLight p-6 brutal-clip">
        <h1 className="font-display text-2xl font-black text-dark mb-1 uppercase">Sign In</h1>
        <p className="font-body text-xs text-gray-500 mb-6">Demo Login</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-clinical border border-borderDark px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="director">Director</option>
              <option value="player">Player/Parent</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-gray-500 uppercase font-bold mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@athleteiq.com"
              className="w-full bg-clinical border border-borderDark px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-dark text-white font-display text-base font-black py-3 brutal-clip hover:bg-brand hover:text-dark transition-all"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-dashed border-borderLight">
          <p className="font-mono text-[10px] text-gray-500 uppercase font-bold mb-3">
            Quick Links
          </p>
          <div className="space-y-2">
            <a href="/admin/portal" className="block text-xs text-brand hover:text-dark font-bold">
              → Super Admin Portal
            </a>
            <a href="/register?token=demo" className="block text-xs text-brand hover:text-dark font-bold">
              → Register with Token
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Home Page
const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-clinical">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border border-borderLight p-8 brutal-clip text-center">
          <h1 className="font-display text-4xl font-black text-dark mb-4 uppercase">
            AthleteIQ Platform
          </h1>
          <p className="font-body text-lg text-gray-600 mb-8">
            Test Mode: Super Admin, Invite-to-Claim, & Player Portal
          </p>

          {user ? (
            <div>
              <p className="font-mono text-sm text-gray-500 mb-4">
                Logged in as <span className="text-brand font-bold">{user.role}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {user.role === 'super_admin' && (
                  <a
                    href="/admin/portal"
                    className="px-6 py-3 bg-dark text-white font-display font-bold hover:bg-brand hover:text-dark transition-all rounded"
                  >
                    → Admin Portal
                  </a>
                )}
                {user.role === 'player' && (
                  <a
                    href="/player/dashboard"
                    className="px-6 py-3 bg-dark text-white font-display font-bold hover:bg-brand hover:text-dark transition-all rounded"
                  >
                    → Player Dashboard
                  </a>
                )}
                <button
                  onClick={logout}
                  className="px-6 py-3 border-2 border-dark text-dark font-display font-bold hover:bg-clinical transition-all rounded"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <a
              href="/login"
              className="inline-block px-8 py-3 bg-dark text-white font-display font-black text-lg hover:bg-brand hover:text-dark transition-all rounded"
            >
              Sign In to Continue
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/portal" element={<ProtectedRoute requiredRole="super_admin"><AdminPortal /></ProtectedRoute>} />
          <Route path="/register" element={<RegisterWithToken />} />
          <Route path="/player/dashboard" element={<ProtectedRoute requiredRole="player"><PlayerDashboard /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
