import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import AuthPage from './Pages/AuthPage';
import Dashboard from './Pages/Dashboard';
import ServicesPage from './Pages/Services';
import ServiceDetail from './Pages/ServiceDetail';
import Profile from './Pages/Profile';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/verify" element={<AuthPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
  );
}

export default App;
