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

export async function GET(request) {
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
    
    // For development/MVP purposes, if no valid token, return all items
    // In production, you would want to restrict this
    let items;
    if (userId) {
      // Get user's items if authenticated
      items = await Item.find({ userId }).sort({ createdAt: -1 });
    } else {
      // Get all items if not authenticated
      items = await Item.find().sort({ createdAt: -1 });
    }
    
    // Return success response with items
    return NextResponse.json(
      { success: true, items },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('User items error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while fetching your items' },
      { status: 500 }
    );
  }
}
