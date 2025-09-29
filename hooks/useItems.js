'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  // Helper function to handle unauthorized responses (invalid/expired token)
  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.error('Your session has expired. Please log in again.');
    router.push('/login');
  }, [router]);

  // Report a lost or found item
  const reportItem = useCallback(async (itemData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token if available, but don't require it
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/items/report', {
        method: 'POST',
        headers,
        body: JSON.stringify(itemData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to report item');
      }
      
      // Show success toast
      toast.success('Item reported successfully!');
      
      return { success: true, item: data.item };
    } catch (error) {
      console.error('Report error:', error.message);
      setError(error.message || 'An error occurred while reporting the item');
      
      // Show error toast
      toast.error(error.message || 'Failed to report item');
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Search for items
  const searchItems = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query string from search params
      const queryString = new URLSearchParams(searchParams).toString();
      console.log('Search API request:', `/api/items/search?${queryString}`);
      
      const response = await fetch(`/api/items/search?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        // Add cache: 'no-store' to prevent caching
        cache: 'no-store'
      });
      
      console.log('Search API response status:', response.status);
      const data = await response.json();
      console.log('Search API response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search items');
      }
      
      if (Array.isArray(data.items)) {
        setItems(data.items);
        console.log(`Set ${data.items.length} items from search`);
      } else {
        console.error('Invalid items data format:', data);
        setItems([]);
      }
      
      return { success: true, items: data.items };
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message || 'An error occurred while searching for items');
      
      // Show error toast
      toast.error(error.message || 'Failed to search items');
      setItems([]);
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all items (admin only)
  const getAdminItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user data from localStorage to extract token
      const userData = localStorage.getItem('user');
      let token = null;
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          token = user.token;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Admin API request headers:', { ...headers, Authorization: headers.Authorization ? 'Bearer [REDACTED]' : undefined });
      
      const response = await fetch('/api/items/admin', {
        method: 'GET',
        headers,
        // Add cache: 'no-store' to prevent caching
        cache: 'no-store'
      });
      
      console.log('Admin API response status:', response.status);
      const data = await response.json();
      console.log('Admin API response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch admin items');
      }
      
      if (Array.isArray(data.items)) {
        setItems(data.items);
        console.log(`Set ${data.items.length} items from admin API`);
      } else {
        console.error('Invalid items data format:', data);
        setItems([]);
      }
      
      return { success: true, items: data.items };
    } catch (error) {
      console.error('Admin items error:', error);
      setError(error.message || 'An error occurred while fetching admin items');
      
      // Show error toast
      toast.error(error.message || 'Failed to fetch admin items');
      setItems([]);
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update item status (admin only)
  const updateItemStatus = useCallback(async (itemId, status) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token if available, but don't require it
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/items/admin`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ itemId, status })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update item status');
      }
      
      // Update local items state
      setItems(prevItems => 
        prevItems.map(item => 
          item._id === itemId ? { ...item, status } : item
        )
      );
      
      // Show success toast
      toast.success(`Item status updated to ${status}`);
      
      return { success: true, item: data.item };
    } catch (error) {
      console.error('Update status error:', error.message);
      setError(error.message || 'An error occurred while updating item status');
      
      // Show error toast
      toast.error(error.message || 'Failed to update item status');
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user items
  const getUserItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token if available, but don't require it
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/items/user', {
        method: 'GET',
        headers
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch your items');
      }
      
      setItems(data.items);
      return { success: true, items: data.items };
    } catch (error) {
      console.error('User items error:', error.message);
      setError(error.message || 'An error occurred while fetching your items');
      
      // Show error toast
      toast.error(error.message || 'Failed to fetch your items');
      
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    items,
    loading,
    error,
    reportItem,
    searchItems,
    getAdminItems,
    updateItemStatus,
    getUserItems
  };
}
