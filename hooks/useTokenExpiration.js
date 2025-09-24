'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';

/**
 * Custom hook to handle token expiration and session management
 * This hook checks token validity and handles automatic logout on token expiration
 */
export default function useTokenExpiration() {
  const { user, logout } = useApp();
  const router = useRouter();

  // Check if token is expired
  const isTokenExpired = useCallback(() => {
    if (!user || !user.token) return true;
    
    try {
      // JWT tokens are in three parts: header.payload.signature
      const payload = user.token.split('.')[1];
      if (!payload) return true;
      
      // Decode the base64 payload
      const decodedPayload = JSON.parse(atob(payload));
      
      // Check if token has expired
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedPayload.exp && decodedPayload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired on error
    }
  }, [user]);

  // Handle logout on token expiration
  const handleExpiredToken = useCallback(() => {
    toast.error('Your session has expired. Please log in again.');
    logout();
    router.push('/login');
  }, [logout, router]);

  // Check token validity on component mount and periodically
  useEffect(() => {
    // Initial check
    if (user && isTokenExpired()) {
      handleExpiredToken();
      return;
    }

    // Set up periodic checks (every minute)
    const intervalId = setInterval(() => {
      if (user && isTokenExpired()) {
        handleExpiredToken();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [user, isTokenExpired, handleExpiredToken]);

  // Set up event listener for API responses with 401 status
  useEffect(() => {
    const handleUnauthorized = (event) => {
      if (event.detail && event.detail.status === 401) {
        handleExpiredToken();
      }
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [handleExpiredToken]);

  return {
    isTokenExpired,
    handleExpiredToken
  };
}
