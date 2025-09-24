'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';

/**
 * OptionalAuthCheck - A component that allows both authenticated and anonymous users
 * but provides the user context if they are logged in
 */
export default function OptionalAuthCheck({ children }) {
  const { user, isAuthenticated, loading } = useApp();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Allow access to both authenticated and anonymous users
  return <>{children}</>;
}
