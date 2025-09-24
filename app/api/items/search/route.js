import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import Item from '@/models/Item';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10); // Default to 20 items
    
    // Build search query
    const searchQuery = {};
    
    if (query) {
      searchQuery.description = { $regex: query, $options: 'i' };
    }
    
    if (type && type !== 'all') {
      searchQuery.type = type;
    }
    
    if (category && category !== 'All Categories') {
      searchQuery.category = category;
    }
    
    // Get items based on search query
    const items = await Item.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    // Return success response with items
    return NextResponse.json(
      { success: true, items },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while searching for items' },
      { status: 500 }
    );
  }
}
