'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useCallback } from 'react';

// Create a context for the enhanced router
const RouterContext = createContext(null);

// Custom hook to use the enhanced router
export const useEnhancedRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useEnhancedRouter must be used within a RouterProvider');
  }
  return context;
};

// Router provider component
export default function RouterProvider({ children }) {
  const router = useRouter();
  
  // Enhanced navigation function
  const navigateTo = useCallback((href) => {
    console.log(`Navigating to: ${href}`);
    
    // Use Next.js router for client-side navigation
    router.push(href);
    
    // Only use window.location for external links
    // if (href.startsWith('http') || href.startsWith('//')) {
    //   window.location.href = href;
    // } else {
    //   router.push(href);
    // }
  }, [router]);
  
  // Create the enhanced router object
  const enhancedRouter = {
    ...router,
    navigateTo
  };
  
  return (
    <RouterContext.Provider value={enhancedRouter}>
      {children}
    </RouterContext.Provider>
  );
}
