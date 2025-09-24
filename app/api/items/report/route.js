import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import Item from '@/models/Item';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export async function POST(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get authorization header (optional now)
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    // If token exists, try to verify it to get the user ID
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded) {
        userId = decoded.id;
      }
    }
    
    // Continue even without authentication
    
    // Parse request body
    const body = await request.json();
    const { type, description, category, location, image, contactInfo } = body;
    
    // Validate input
    if (!type || !description || !category || !location) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // Validate type
    if (type !== 'lost' && type !== 'found') {
      return NextResponse.json(
        { success: false, error: 'Type must be either "lost" or "found"' },
        { status: 400 }
      );
    }
    
    // Create new item
    const item = await Item.create({
      type,
      description,
      category,
      location,
      image: image || '',
      userId: userId || '000000000000000000000000', // Use a default ID for anonymous users
      status: 'pending',
      isAnonymous: !userId, // Flag to indicate if this was submitted anonymously
      contactInfo: contactInfo || '' // Store contact information
    });
    
    // Return success response
    return NextResponse.json(
      { success: true, item },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Report item error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while reporting the item' },
      { status: 500 }
    );
  }
}
