'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp, Item, SearchParams } from '@/context/AppContext';
import SearchBar from '@/app/components/SearchBar';
import ItemList from '@/app/components/ItemList';
import AnonymousBanner from '@/app/components/AnonymousBanner';
import Navigation from '@/app/components/Navigation';
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { searchItems, items, itemsLoading, itemsError, user } = useApp();
  const [isSearching, setIsSearching] = useState(false);
  
  // Extract search parameters from URL and convert null to undefined for TypeScript compatibility
  const queryParam = searchParams?.get('query');
  const typeParam = searchParams?.get('type');
  const categoryParam = searchParams?.get('category');
  
  const query = queryParam === null ? undefined : queryParam;
  const type = typeParam === null ? undefined : typeParam;
  const category = categoryParam !== null && categoryParam !== 'All Categories' ? categoryParam : undefined;
  
  // Use a ref to track if the initial search has been performed
  const initialSearchPerformedRef = useRef(false);

  // Perform search when parameters change or on initial load
  useEffect(() => {
    const performSearch = async () => {
      // Skip if we're already searching to prevent loops
      if (isSearching) return;
      
      setIsSearching(true);
      try {
        console.log('Searching with params:', { query, type, category });
        
        // If there are search parameters, use them; otherwise, fetch recent items
        if (query || type || category) {
          const result = await searchItems({ 
            query, 
            type, 
            category 
          });
          console.log('Search result with params:', result);
        } else {
          // Fetch recent items by default
          const result = await searchItems({ limit: 20 });
          console.log('Default search result:', result);
        }
        
        // Mark that we've performed the initial search
        initialSearchPerformedRef.current = true;
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Only perform search if it's the initial render or if search params have changed
    if (!initialSearchPerformedRef.current || query !== undefined || type !== undefined || category !== undefined) {
      performSearch();
    }
  }, [query, type, category, searchItems, isSearching]);
  
  // Debug log when items change
  useEffect(() => {
    console.log('Items updated in search page:', items);
  }, [items]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnonymousBanner />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Search Lost & Found Items</h1>
            <p className="text-gray-600">Find items that have been reported lost or found</p>
          </div>
          <div className="w-full md:w-auto">
            <Link
              href="/report"
              prefetch={true}
              className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center md:justify-start"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Report Item
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <SearchBar onSearch={(params: SearchParams) => {
            searchItems(params);
          }} />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Debug info */}
          <div className="p-4 bg-yellow-50 border-b border-yellow-100">
            <p className="text-sm font-mono">Debug Info:</p>
            <p className="text-sm font-mono">Items: {Array.isArray(items) ? items.length : 'not an array'}</p>
            <p className="text-sm font-mono">Loading: {(isSearching || itemsLoading) ? 'true' : 'false'}</p>
            <p className="text-sm font-mono">Error: {itemsError || 'none'}</p>
          </div>
          
          <ItemList 
            items={Array.isArray(items) ? items : []} 
            isLoading={isSearching || itemsLoading} 
            error={itemsError || null} 
          />
        </div>
      </div>
    </div>
  );
}
