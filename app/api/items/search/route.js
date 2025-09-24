import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import Item from '@/models/Item';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    console.log('Search API called');
    
    // Connect to database
    await dbConnect();
    console.log('Database connected');
    
    // Get search parameters from URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '20', 10); // Default to 20 items
    
    console.log('Search params:', { query, type, category, limit });
    
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
    
    console.log('MongoDB query:', JSON.stringify(searchQuery));
    
    // Get items based on search query
    const items = await Item.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    console.log(`Found ${items.length} items`);
    
    // Return success response with items
    return NextResponse.json(
      { success: true, items, count: items.length },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
    
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while searching for items' },
      { status: 500 }
    );
  }
}
