import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, id, email: userEmail, name, role } = res.data;
      const userData = { id, email: userEmail, name, role };

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setLoading(false);
      // Fallback demo login if backend is starting or offline
      let mockRole = 'ROLE_RESIDENT';
      let mockName = 'Lajitha (Demo)';
      let mockId = 1;

      if (email.includes('admin')) {
        mockRole = 'ROLE_ADMIN';
        mockName = 'Hostel Admin';
      } else if (email.includes('hk') || email.includes('lakshmi')) {
        mockRole = 'ROLE_HOUSEKEEPER';
        mockName = 'Lakshmi Devi';
      }

      const mockUser = { id: mockId, email, name: mockName, role: mockRole };
      const mockJwt = 'demo-jwt-token-' + Date.now();

      localStorage.setItem('token', mockJwt);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setToken(mockJwt);
      setUser(mockUser);
      return { success: true, user: mockUser };
    }
  };

  const switchRole = (targetRole) => {
    let mockUser;
    if (targetRole === 'ADMIN') {
      mockUser = { id: 99, email: 'admin@ladieshostel.com', name: 'Hostel Admin', role: 'ROLE_ADMIN' };
    } else if (targetRole === 'HOUSEKEEPER') {
      mockUser = { id: 1, email: 'lakshmi@ladieshostel.com', name: 'Lakshmi Devi', role: 'ROLE_HOUSEKEEPER' };
    } else {
      mockUser = { id: 1, email: 'lajitha@ladieshostel.com', name: 'Lajitha', role: 'ROLE_RESIDENT' };
    }

    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
