import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import AuthPage from './Pages/AuthPage';
import Dashboard from './Pages/Dashboard';
import ServicesPage from './Pages/Services';
import ServiceDetail from './Pages/ServiceDetail';
import Profile from './Pages/Profile';
import Home from './Pages/Home';
import Privacy from './Pages/Privacy';
import Terms from './Pages/Terms';
import NotFound from './Pages/404';
import Docs from './Pages/Docs';
import IpManager from './Pages/IPManager';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify" element={<AuthPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ipmanage" element={<IpManager />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
