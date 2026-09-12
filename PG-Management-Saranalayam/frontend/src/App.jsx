import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ResidentDashboard } from './pages/ResidentDashboard';
import { HousekeeperDashboard } from './pages/HousekeeperDashboard';

const MainContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  switch (user.role) {
    case 'ROLE_ADMIN':
      return <AdminDashboard />;
    case 'ROLE_HOUSEKEEPER':
      return <HousekeeperDashboard />;
    case 'ROLE_RESIDENT':
    default:
      return <ResidentDashboard />;
  }
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <RoleSwitcherBar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="*" element={<MainContent />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
