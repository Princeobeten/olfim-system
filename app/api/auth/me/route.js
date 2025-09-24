import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No token provided', isAuthenticated: false },
        { status: 200 }
      );
    }
    
    // Get token from header
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find user by id
      const user = await User.findById(decoded.id);
      
      // Check if user exists
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found', isAuthenticated: false },
          { status: 200 } // Return 200 instead of 404 to handle gracefully
        );
      }
      
      // Return success response with user data
      const userObj = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      
      return NextResponse.json(
        { success: true, user: userObj },
        { status: 200 }
      );
      
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token', isAuthenticated: false },
        { status: 200 }
      );
    }
    
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while getting user data' },
      { status: 500 }
    );
  }
}
