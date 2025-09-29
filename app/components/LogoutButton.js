'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LogoutButton({ className = '' }) {
  const { logout, user } = useApp();
  const router = useRouter();

  // If user is not logged in, don't show the button
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/dashboard');
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center text-gray-600 hover:text-red-600 transition-colors ${className}`}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-1" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
        />
      </svg>
      <span>Logout</span>
    </button>
  );
}
