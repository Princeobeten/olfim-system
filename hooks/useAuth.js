'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create account');
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during signup');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to login');
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      router.push('/login');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const getCurrentUser = () => {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  };

  return { signup, login, logout, getCurrentUser, loading, error };
}
