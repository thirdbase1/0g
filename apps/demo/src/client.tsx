import React from 'react';
import { createRoot } from 'react-dom/client';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './index.css';

const App = () => {
  const path = window.location.pathname;
  try {
    if (path === '/dashboard') return <Dashboard />;
    if (path === '/login') return <Login />;
    if (path === '/admin') return <Admin />;
    return <Landing />;
  } catch (err) {
    console.error("Render error:", err);
    return <div>Error rendering app: {String(err)}</div>;
  }
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
