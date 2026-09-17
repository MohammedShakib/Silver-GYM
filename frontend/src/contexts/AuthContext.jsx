import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    checkAuth();
  }, []);

  const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

  const checkAuth = async () => {
    try {
      // In mock mode, fall back to mock data
      if (import.meta.env.VITE_DATA_MODE !== 'api') {
        const { mockUser } = await import('../services/mockData');
        setUser(mockUser);
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${getBaseUrl()}/auth/me`, {
        credentials: 'default', // will use include if backend allows
        headers: { 'Accept': 'application/json' }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      if (import.meta.env.VITE_DATA_MODE !== 'api') {
        const { mockUser } = await import('../services/mockData');
        setUser(mockUser);
        return { success: true, user: mockUser };
      }

      const res = await fetch(`${getBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(data);
        return { success: true, user: data };
      }
      return { success: false, error: data.error?.message || 'Login failed' };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      if (import.meta.env.VITE_DATA_MODE !== 'api') {
        const { mockUser } = await import('../services/mockData');
        setUser(mockUser);
        return { success: true, user: mockUser };
      }

      const res = await fetch(`${getBaseUrl()}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(data);
        return { success: true, user: data };
      }
      return { success: false, error: data.error?.message || 'Registration failed' };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      if (import.meta.env.VITE_DATA_MODE === 'api') {
        await fetch(`${getBaseUrl()}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    checkAuth,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
