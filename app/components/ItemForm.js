'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

const categories = [
  'Electronics',
  'Books',
  'Clothing',
  'Accessories',
  'Documents',
  'Keys',
  'Wallets',
  'Other'
];

const locations = [
  'Main Campus',
  'Science Block',
  'Library',
  'Cafeteria',
  'Hostel A',
  'Hostel B',
  'Sports Complex',
  'Admin Block',
  'Other'
];

export default function ItemForm({ type = 'lost' }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { reportItem } = useApp();
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!description || !category || !location) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Report item
      const result = await reportItem({
        type,
        description,
        category,
        location,
        image,
        contactInfo
      });
      
      if (result.success) {
        // Redirect to user's items page
        router.push('/search?type=' + type);
      } else {
        setError(result.error || 'Failed to report item');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // For MVP, we'll just use a placeholder image URL
    // In a real app, you would upload to a service like Cloudinary
    setImage('https://via.placeholder.com/150');
    
    // Alternatively, you could use a data URL for demo purposes
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setImage(reader.result);
    // };
    // reader.readAsDataURL(file);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Report {type === 'lost' ? 'a Lost' : 'a Found'} Item
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Describe the item in detail (color, brand, distinctive features, etc.)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
            Category *
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Location *
          </label>
          <select
            id="location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
            Image (Optional)
          </label>
          <input
            type="file"
            id="image"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload an image of the item (max 5MB)
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="contactInfo" className="block text-gray-700 font-medium mb-2">
            Contact Information
          </label>
          <input
            type="text"
            id="contactInfo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone number or email where you can be reached"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            This helps us contact you when your item is found/claimed
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
