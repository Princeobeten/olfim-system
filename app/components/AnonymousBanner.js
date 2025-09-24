'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function AnonymousBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { user } = useApp();

  // If user is authenticated or banner was dismissed, don't show it
  if (user || dismissed) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">
              <strong>You are using the system anonymously.</strong> You can report lost/found items and search without logging in. 
              For better tracking and notifications, consider <a href="/login" className="font-medium underline">logging in</a> or 
              <a href="/signup" className="font-medium underline"> creating an account</a>.
            </p>
            <button 
              onClick={() => setDismissed(true)}
              className="ml-4 flex-shrink-0 text-blue-500 hover:text-blue-700"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
