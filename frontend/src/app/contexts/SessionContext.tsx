'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'user' | 'judge' | 'admin' | 'organizer';
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  skills: string[];
  interests: string[];
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: number;
  createdAt: number;
  updatedAt: number;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      setLoading(true);
      
      // Check if user data exists in localStorage (from login)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setLoading(false);
        return;
      }

      // If no stored user, check with server
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.user) {
          setUser(data.data.user);
          // Store in localStorage for client-side access
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
      }
    } catch (err) {
      console.error('Session initialization error:', err);
      setError('Failed to initialize session');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data.user) {
        setUser(data.data.user);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return true;
      } else {
        setError(data.error || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Clear local state
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.user) {
          setUser(data.data.user);
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
      setError('Failed to refresh user data');
    } finally {
      setLoading(false);
    }
  };

  const value: SessionContextType = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    isAuthenticated,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
