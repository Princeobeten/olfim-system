'use client';

import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import LogoutButton from './LogoutButton';

export default function Navigation() {
  const { user } = useApp();
  const pathname = usePathname();
  
  // Debug logging
  console.log('Navigation render - user:', user);
  console.log('Navigation render - pathname:', pathname);
  
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                LF
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">OLFIM</span>
            </a>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a 
                href="/search" 
                onClick={() => console.log('Search link clicked')}
                className={`${pathname === '/search' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Search
              </a>
              <a 
                href="/report" 
                onClick={() => console.log('Report link clicked')}
                className={`${pathname === '/report' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Report
              </a>
              {user && (
                <>
                  <a 
                    href="/dashboard" 
                    onClick={() => console.log('Dashboard link clicked')}
                    className={`${pathname === '/dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Dashboard
                  </a>
                  {user.role === 'admin' && (
                    <a 
                      href="/admin" 
                      onClick={() => console.log('Admin link clicked')}
                      className={`${pathname === '/admin' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      Admin
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!user && (
              <a
                href="/report"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Report Item
              </a>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Hello, {user.name || 'User'}</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex space-x-3">
                <a href="/login" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </a>
                <a href="/signup" className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200 pt-2 pb-3 px-4">
        <div className="flex flex-col space-y-2">
          <a 
            href="/search" 
            className={`${pathname === '/search' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'} px-3 py-2 text-base font-medium`}
          >
            Search
          </a>
          <a 
            href="/report" 
            className={`${pathname === '/report' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'} px-3 py-2 text-base font-medium`}
          >
            Report
          </a>
          {user && (
            <>
              <a 
                href="/dashboard" 
                className={`${pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'} px-3 py-2 text-base font-medium`}
              >
                Dashboard
              </a>
              {user.role === 'admin' && (
                <a 
                  href="/admin" 
                  className={`${pathname === '/admin' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-800'} px-3 py-2 text-base font-medium`}
                >
                  Admin
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
