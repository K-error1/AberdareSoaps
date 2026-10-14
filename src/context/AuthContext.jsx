import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aberdares_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Validate session on mount
  useEffect(() => {
    const token = localStorage.getItem('aberdares_access_token');
    if (token) {
      api.getMe()
        .then(userData => {
          setUser(userData);
          localStorage.setItem('aberdares_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      if (res.access) {
        localStorage.setItem('aberdares_access_token', res.access);
      }
      if (res.refresh) {
        localStorage.setItem('aberdares_refresh_token', res.refresh);
      }
      localStorage.setItem('aberdares_user', JSON.stringify(res.user));
      setIsAuthModalOpen(false);
      return res.user;
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, name, phone }) => {
    setLoading(true);
    setAuthError('');
    try {
      const res = await api.register({ email, password, name, phone });
      setUser(res.user);
      if (res.access) {
        localStorage.setItem('aberdares_access_token', res.access);
      }
      if (res.refresh) {
        localStorage.setItem('aberdares_refresh_token', res.refresh);
      }
      localStorage.setItem('aberdares_user', JSON.stringify(res.user));
      setIsAuthModalOpen(false);
      return res.user;
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore network errors on logout
    }
    setUser(null);
    localStorage.removeItem('aberdares_access_token');
    localStorage.removeItem('aberdares_refresh_token');
    localStorage.removeItem('aberdares_user');
  };

  const openLogin = () => {
    setAuthMode('login');
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        openLogin,
        openRegister,
        login,
        register,
        logout,
        loading,
        authError,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
