'use client';

import { useApp } from '@/context/AppContext';
import LoginPrompt from './LoginPrompt';

export default function AuthCheck({ children }) {
  const { user, isAuthenticated, loading } = useApp();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <>{children}</>;
}
