import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TerminalAppPage from './pages/TerminalAppPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/app" 
        element={
          <PrivateRoute>
            <TerminalAppPage />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/app" />} />
    </Routes>
  );
}

export default App;
