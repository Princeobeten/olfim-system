'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import AuthCheck from '@/app/components/AuthCheck';
import ItemList from '@/app/components/ItemList';
import Navigation from '@/app/components/Navigation';
import Card, { CardHeader, CardBody } from '@/app/components/ui/Card';
import Link from 'next/link';

export default function AdminPage() {
  const { user, getAdminItems, items, itemsLoading, itemsError, hasRole } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    matched: 0,
    claimed: 0,
    total: 0,
    lost: 0,
    found: 0
  });
  
  useEffect(() => {
    // Fetch all items when the component mounts
    const fetchItems = async () => {
      try {
        console.log('Fetching admin items for admin page...');
        const result = await getAdminItems();
        console.log('Admin items fetch result:', result);
      } catch (error) {
        console.error('Error fetching admin items:', error);
      }
    };
    
    fetchItems();
  }, []); // Remove getAdminItems dependency to prevent infinite loop
  
  // Calculate status counts when items change
  useEffect(() => {
    if (items && items.length > 0) {
      const counts = {
        pending: 0,
        matched: 0,
        claimed: 0,
        total: items.length,
        lost: 0,
        found: 0
      };
      
      items.forEach(item => {
        // Count by status
        if (item.status) {
          counts[item.status] += 1;
        }
        
        // Count by type
        if (item.type === 'lost') {
          counts.lost += 1;
        } else if (item.type === 'found') {
          counts.found += 1;
        }
      });
      
      setStatusCounts(counts);
    }
  }, [items]);
  
  // Filter items by status
  const pendingItems = items ? items.filter(item => item.status === 'pending') : [];
  const matchedItems = items ? items.filter(item => item.status === 'matched') : [];
  const claimedItems = items ? items.filter(item => item.status === 'claimed') : [];
  
  // Get the active items based on the selected tab
  const getActiveItems = () => {
    switch (activeTab) {
      case 'pending':
        return pendingItems;
      case 'matched':
        return matchedItems;
      case 'claimed':
        return claimedItems;
      default:
        return items || [];
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Advanced administration tools</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                prefetch={true}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </Link>
            </div>
          </div>
          
          {/* Admin check */}
          {!hasRole('admin') ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    You do not have admin privileges to access this page.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Admin Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden rounded-xl shadow-lg border border-gray-100">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">Total Items</h3>
                        <div className="text-3xl font-bold text-gray-900 mt-1">{statusCounts.total}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden rounded-xl shadow-lg border border-gray-100">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">Pending Items</h3>
                        <div className="text-3xl font-bold text-gray-900 mt-1">{statusCounts.pending}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden rounded-xl shadow-lg border border-gray-100">
                  <div className="bg-gradient-to-r from-green-500 to-green-700 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">Matched Items</h3>
                        <div className="text-3xl font-bold text-gray-900 mt-1">{statusCounts.matched}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden rounded-xl shadow-lg border border-gray-100">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-2"></div>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">Claimed Items</h3>
                        <div className="text-3xl font-bold text-gray-900 mt-1">{statusCounts.claimed}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Admin Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">System Management</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-gray-600 mb-4">Manage system settings and configurations.</p>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      System Settings
                    </button>
                  </CardBody>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-gray-600 mb-4">Manage users and their permissions.</p>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                      Manage Users
                    </button>
                  </CardBody>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Data Export</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-gray-600 mb-4">Export system data and reports.</p>
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                      Export Data
                    </button>
                  </CardBody>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthCheck>
  );
}
