'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import AuthCheck from '@/app/components/AuthCheck'; // Keep using AuthCheck for dashboard
import ItemList from '@/app/components/ItemList';
import Navigation from '@/app/components/Navigation';
import Card, { CardHeader, CardBody } from '@/app/components/ui/Card';
import Link from 'next/link';

export default function Dashboard() {
  const { user, getAdminItems, items, itemsLoading, itemsError, hasRole } = useApp();
  const [activeTab, setActiveTab] = useState('pending');
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
        console.log('Fetching admin items...');
        const result = await getAdminItems();
        console.log('Admin items fetch result:', result);
      } catch (error) {
        console.error('Error fetching admin items:', error);
      }
    };
    
    fetchItems();
  }, []); // Remove getAdminItems dependency to prevent infinite loop
  
  // Debug log when items change
  useEffect(() => {
    console.log('Items updated in dashboard:', items);
    console.log('Items length:', items?.length);
  }, [items]);
  
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
  
  // Stats for the dashboard
  const stats = [
    {
      title: 'Total Items',
      value: statusCounts.total.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: 'Pending Items',
      value: statusCounts.pending.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Lost Items',
      value: statusCounts.lost.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Found Items',
      value: statusCounts.found.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage lost and found items</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/search"
              prefetch={true}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Items
            </Link>
            <Link
              href="/report"
              prefetch={true}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Report Item
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                // Determine card color based on stat title
                let bgColor = 'bg-blue-100';
                let textColor = 'text-blue-600';
                let gradientFrom = 'from-blue-500';
                let gradientTo = 'to-blue-700';
                
                if (stat.title.includes('Lost')) {
                  bgColor = 'bg-red-100';
                  textColor = 'text-red-600';
                  gradientFrom = 'from-red-500';
                  gradientTo = 'to-red-700';
                } else if (stat.title.includes('Found')) {
                  bgColor = 'bg-green-100';
                  textColor = 'text-green-600';
                  gradientFrom = 'from-green-500';
                  gradientTo = 'to-green-700';
                } else if (stat.title.includes('Pending')) {
                  bgColor = 'bg-yellow-100';
                  textColor = 'text-yellow-600';
                  gradientFrom = 'from-yellow-500';
                  gradientTo = 'to-yellow-700';
                }
                
                return (
                  <div key={index} className="bg-white overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} h-2`}></div>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center ${textColor}`}>
                            {stat.icon}
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{stat.title}</h3>
                          <div className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Tabs */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 border border-gray-100">
              <div className="flex flex-wrap md:flex-nowrap">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium relative transition-all duration-200 ${activeTab === 'pending' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('pending')}
                >
                  <div className="flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
                    Pending Items ({statusCounts.pending})
                  </div>
                  {activeTab === 'pending' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500"></div>
                  )}
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium relative transition-all duration-200 ${activeTab === 'matched' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('matched')}
                >
                  <div className="flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-blue-400 mr-2"></span>
                    Matched Items ({statusCounts.matched})
                  </div>
                  {activeTab === 'matched' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                  )}
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium relative transition-all duration-200 ${activeTab === 'claimed' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('claimed')}
                >
                  <div className="flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-green-400 mr-2"></span>
                    Claimed Items ({statusCounts.claimed})
                  </div>
                  {activeTab === 'claimed' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
                  )}
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium relative transition-all duration-200 ${activeTab === 'all' ? 'text-gray-800 bg-gray-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('all')}
                >
                  <div className="flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-gray-400 mr-2"></span>
                    All Items ({statusCounts.total})
                  </div>
                  {activeTab === 'all' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-500"></div>
                  )}
                </button>
              </div>
            </div>
            
            {/* Items List Container */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'all' ? 'All Items' : 
                     activeTab === 'pending' ? 'Pending Items' : 
                     activeTab === 'matched' ? 'Matched Items' : 'Claimed Items'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <select className="text-sm border-gray-300 rounded-md p-1">
                      <option>Most Recent</option>
                      <option>Oldest First</option>
                      <option>Alphabetical</option>
                    </select>
                  </div>
                </div>
                
                {/* Items List */}
                {itemsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-500">Loading items...</p>
                  </div>
                ) : itemsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-red-800">Error Loading Items</h3>
                        <p className="mt-2 text-sm text-red-700">
                          {itemsError}
                        </p>
                        <div className="mt-4">
                          <button 
                            onClick={() => getAdminItems()} 
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : getActiveItems().length > 0 ? (
                  <ItemList items={getActiveItems()} isAdmin={true} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-24 w-24 text-gray-300 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeTab !== 'all' ? activeTab : ''} items found</h3>
                    <p className="text-gray-500 mb-6">There are no items to display in this category.</p>
                    <Link
                      href="/report"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Report New Item
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Admin Tips and Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Admin Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Use the tabs to filter items by status</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Click on an item to see details and update its status</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Match lost items with found ones when possible</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center p-2 hover:bg-purple-100/50 rounded-lg transition-colors">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Item matched successfully</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-2 hover:bg-purple-100/50 rounded-lg transition-colors">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">New item reported</p>
                      <p className="text-xs text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">System Status</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Database</span>
                      <span className="text-sm font-medium text-green-600">Online</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">API Services</span>
                      <span className="text-sm font-medium text-green-600">Operational</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Storage</span>
                      <span className="text-sm font-medium text-yellow-600">72% Used</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </AuthCheck>
  );
}
