import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage.jsx';
import { AboutUs } from './pages/AboutUs.jsx';
import { Login } from './pages/Login.jsx';
import { DashboardOverview } from './pages/Dashboard.jsx';
import { PartnerView } from './pages/PartnerView.jsx';

// Auth context to avoid multiple fetches when multiple protected routes mount
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ loading: true, authenticated: false, user: null });
  useEffect(() => {
    const apiBase = process.env.REACT_APP_API_BASE;
    fetch(`${apiBase}/auth/session`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setState({ loading: false, authenticated: !!d.authenticated, user: d.user || null }))
      .catch(() => setState(s => ({ ...s, loading: false })));
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

const useSession = () => useContext(AuthContext) || { loading: true, authenticated: false };

const RequireAuth = ({ children }) => {
  const session = useSession();
  const location = useLocation();
  if (session.loading) return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Checking session...</div>;
  if (!session.authenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
};

// Simple layout/navigation placeholder (can be replaced with actual nav components)
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<RequireAuth><DashboardOverview /></RequireAuth>} />
    <Route path="/DashboardOverview" element={<Navigate to="/dashboard" replace />} />
  <Route path="/partner" element={<PartnerView />} />
    <Route path="*" element={<div style={{padding: '2rem', fontFamily: 'sans-serif'}}><h2>404 - Page Not Found</h2><p>The page you are looking for does not exist.</p></div>} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
