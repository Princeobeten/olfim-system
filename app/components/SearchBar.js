'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  'All Categories',
  'Electronics',
  'Books',
  'Clothing',
  'Accessories',
  'Documents',
  'Keys',
  'Wallets',
  'Other'
];

export default function SearchBar({ onSearch }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('All Categories');
  
  // Initialize form values from URL params
  useEffect(() => {
    const queryParam = searchParams.get('query') || '';
    const typeParam = searchParams.get('type') || 'all';
    const categoryParam = searchParams.get('category') || 'All Categories';
    
    console.log('SearchBar: URL params:', { queryParam, typeParam, categoryParam });
    
    setQuery(queryParam);
    setType(typeParam);
    setCategory(categoryParam);
  }, [searchParams]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build search params
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (type !== 'all') params.set('type', type);
    if (category !== 'All Categories') params.set('category', category);
    
    console.log('SearchBar: Submitting search with params:', { query, type, category });
    console.log('SearchBar: URL params string:', params.toString());
    
    // Update URL
    router.push(`/search?${params.toString()}`);
    
    // Call onSearch callback if provided
    if (onSearch) {
      const searchParams = {
        query,
        type: type !== 'all' ? type : '',
        category: category !== 'All Categories' ? category : ''
      };
      
      console.log('SearchBar: Calling onSearch with:', searchParams);
      onSearch(searchParams);
    } else {
      console.log('SearchBar: No onSearch callback provided');
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="query" className="block text-gray-700 text-sm font-medium mb-1">
              Search
            </label>
            <input
              type="text"
              id="query"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter keywords (e.g., blue backpack, iPhone)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-gray-700 text-sm font-medium mb-1">
              Type
            </label>
            <select
              id="type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
