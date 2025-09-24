'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import ItemForm from '@/app/components/ItemForm';
import AnonymousBanner from '@/app/components/AnonymousBanner';
import Navigation from '@/app/components/Navigation';
import Link from 'next/link';

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState('lost');
  const [animateForm, setAnimateForm] = useState(false);
  const { user } = useApp();
  
  // Animation effect when switching tabs
  useEffect(() => {
    setAnimateForm(true);
    const timer = setTimeout(() => setAnimateForm(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnonymousBanner />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Report Lost & Found Items</h1>
          <p className="text-gray-600 mt-2">Fill out the form below to report a lost or found item</p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/search"
            prefetch={true}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Search
          </Link>
          <Link
            href="/dashboard"
            prefetch={true}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <span>View My Reports</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-4 px-6 font-medium ${activeTab === 'lost' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('lost')}
            >
              Report Lost Item
            </button>
            <button
              className={`py-4 px-6 font-medium ${activeTab === 'found' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('found')}
            >
              Report Found Item
            </button>
          </div>
          <div className="p-6">
            <div className={`transition-opacity duration-300 ${animateForm ? 'opacity-0' : 'opacity-100'}`}>
              <ItemForm type={activeTab} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tips for Reporting</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">For Lost Items:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Be as specific as possible with your description</li>
                <li>Include any unique identifying features</li>
                <li>Provide the approximate date and location where the item was lost</li>
                <li>Upload a photo if available</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">For Found Items:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Don't include personally identifiable information in public descriptions</li>
                <li>Be specific about where and when the item was found</li>
                <li>Store the item in a safe place</li>
                <li>Upload a photo that doesn't reveal sensitive details</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
