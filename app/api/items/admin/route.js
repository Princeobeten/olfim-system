import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import Item from '@/models/Item';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';

// Verify JWT token and check admin role
const verifyAdminToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return null;
    }
    return decoded;
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
    let isAdmin = false;
    
    // If token exists, try to verify it to check admin role
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAdminToken(token);
      if (decoded) {
        isAdmin = true;
      }
    }
    
    // For development/MVP purposes, allow access without authentication
    // In production, you would want to uncomment the following check
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { success: false, error: 'Admin access required' },
    //     { status: 403 }
    //   );
    // }
    
    // Get all items
    const items = await Item.find().sort({ createdAt: -1 });
    
    // Return success response with items
    return NextResponse.json(
      { success: true, items },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Admin items error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while fetching admin items' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get authorization header (optional now)
    const authHeader = request.headers.get('authorization');
    let isAdmin = false;
    
    // If token exists, try to verify it to check admin role
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAdminToken(token);
      if (decoded) {
        isAdmin = true;
      }
    }
    
    // For development/MVP purposes, allow access without authentication
    // In production, you would want to uncomment the following check
    // if (!isAdmin) {
    //   return NextResponse.json(
    //     { success: false, error: 'Admin access required' },
    //     { status: 403 }
    //   );
    // }
    
    // Parse request body
    const body = await request.json();
    const { itemId, status } = body;
    
    // Validate input
    if (!itemId || !status) {
      return NextResponse.json(
        { success: false, error: 'Please provide itemId and status' },
        { status: 400 }
      );
    }
    
    // Validate status
    if (!['pending', 'matched', 'claimed'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be one of: pending, matched, claimed' },
        { status: 400 }
      );
    }
    
    // Find and update item
    const item = await Item.findByIdAndUpdate(
      itemId,
      { status },
      { new: true, runValidators: true }
    );
    
    // Check if item exists
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Return success response with updated item
    return NextResponse.json(
      { success: true, item },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Update item status error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while updating item status' },
      { status: 500 }
    );
  }
}
