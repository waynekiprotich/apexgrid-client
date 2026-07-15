import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Drivers from '../pages/Drivers';
import DriverDetails from '../pages/DriverDetails';
import Teams from '../pages/Teams';
import Sessions from '../pages/Sessions';
import RaceCenter from '../pages/RaceCenter';
import Analytics from '../pages/Analytics';
import Favorites from '../pages/Favorites';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Register from '../pages/Register';

const ProtectedRoute = ({ children }) => {
  const { accessToken } = useAuth();
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const NotFound = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center text-center px-4">
    <div>
      <p className="text-7xl font-black text-primary mb-4">404</p>
      <h1 className="text-xl font-bold text-text mb-2">Page not found</h1>
      <p className="text-muted text-sm mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">← Back to Home</Link>
    </div>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/drivers" element={<Drivers />} />
    <Route path="/drivers/:id" element={<DriverDetails />} />
    <Route path="/teams" element={<Teams />} />
    <Route path="/sessions" element={<Sessions />} />
    <Route path="/race-center/:sessionKey" element={<RaceCenter />} />
    <Route path="/analytics" element={<Analytics />} />

    <Route path="/favorites" element={
      <ProtectedRoute><Favorites /></ProtectedRoute>
    } />
    <Route path="/settings" element={
      <ProtectedRoute><Settings /></ProtectedRoute>
    } />

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
