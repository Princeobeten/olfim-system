'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';

interface Item {
  _id: string;
  type: string;
  description: string;
  category: string;
  location: string;
  image?: string;
  status: string;
  userId: string;
  isAnonymous?: boolean;
  contactInfo?: string;
  createdAt: string;
}

interface ItemListProps {
  items: Item[];
  isAdmin?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export default function ItemList({ items = [], isAdmin = false, isLoading = false, error = null }: ItemListProps) {
  const { updateItemStatus } = useApp();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Debug logging
  console.log('ItemList render with:', { itemsLength: items?.length, isAdmin, isLoading, error });
  console.log('Items data:', items);
  
  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-500 mt-4">Loading items...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (!items || items.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-500">No items found. Try adjusting your search criteria.</p>
      </div>
    );
  }
  
  const handleStatusUpdate = async (itemId: string, newStatus: string) => {
    try {
      await updateItemStatus(itemId, newStatus);
      toast.success(`Item status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update item status');
      console.error('Error updating item status:', error);
    }
  };
  
  const toggleExpand = (itemId: string) => {
    if (expandedItem === itemId) {
      setExpandedItem(null);
    } else {
      setExpandedItem(itemId);
    }
  };
  
  return (
    <div className="divide-y divide-gray-200">
      {items.map((item) => (
        <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.type === 'lost' ? 'Lost' : 'Found'}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                {isAdmin && (
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    item.status === 'matched' ? 'bg-blue-100 text-blue-800' : 
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900">{item.description}</h3>
              <div className="mt-1 text-sm text-gray-500">
                <p><span className="font-medium">Category:</span> {item.category}</p>
                <p><span className="font-medium">Location:</span> {item.location}</p>
              </div>
            </div>
            {item.image && (
              <div className="mt-4 md:mt-0 md:ml-6">
                <div className="h-24 w-24 relative rounded-md overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.description}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => toggleExpand(item._id)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {expandedItem === item._id ? 'Show less' : 'Show more'}
            </button>
            
            {isAdmin && (
              <div className="flex space-x-2">
                <select
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  value={item.status}
                  onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="matched">Matched</option>
                  <option value="claimed">Claimed</option>
                </select>
              </div>
            )}
          </div>
          
          {expandedItem === item._id && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
              <p className="text-sm text-gray-700">
                {item.isAnonymous ? (
                  'This item was reported anonymously. Please contact the administrator for more information.'
                ) : (
                  item.contactInfo || 'No contact information provided.'
                )}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
