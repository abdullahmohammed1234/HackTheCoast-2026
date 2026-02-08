import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import Listing from '@/models/Listing';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';

// GET - Fetch user's wishlist
export async function GET(req: NextRequest) {
  const rateLimitResult = rateLimit(req, rateLimitConfigs.api);
  const response = NextResponse.next();
  
  response.headers.set('X-RateLimit-Limit', rateLimitConfigs.api.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', (rateLimitConfigs.api.maxRequests - 1).toString());
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const wishlist = await Wishlist.findOne({ userId: session.user.id }).populate({
      path: 'items.listingId',
      populate: {
        path: 'userId',
        select: 'name email',
      },
    });

    return NextResponse.json({ wishlist: wishlist || { items: [] } });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add item to wishlist
export async function POST(req: NextRequest) {
  const rateLimitResult = rateLimit(req, rateLimitConfigs.api);
  const response = NextResponse.next();
  
  response.headers.set('X-RateLimit-Limit', rateLimitConfigs.api.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', (rateLimitConfigs.api.maxRequests - 1).toString());
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { listingId } = await req.json();

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId: session.user.id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: session.user.id, items: [] });
    }

    // Check if item already in wishlist
    const existingItem = wishlist.items.find(
      (item: any) => item.listingId.toString() === listingId
    );

    if (existingItem) {
      return NextResponse.json({ error: 'Item already in wishlist' }, { status: 400 });
    }

    wishlist.items.push({ listingId } as any);
    await wishlist.save();

    await wishlist.populate({
      path: 'items.listingId',
      populate: {
        path: 'userId',
        select: 'name email',
      },
    });

    return NextResponse.json({ wishlist }, { status: 201 });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(req: NextRequest) {
  const rateLimitResult = rateLimit(req, rateLimitConfigs.api);
  const response = NextResponse.next();
  
  response.headers.set('X-RateLimit-Limit', rateLimitConfigs.api.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', (rateLimitConfigs.api.maxRequests - 1).toString());
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    const wishlist = await Wishlist.findOne({ userId: session.user.id });
    
    if (!wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    wishlist.items = wishlist.items.filter(
      (item: any) => item.listingId.toString() !== listingId
    );
    await wishlist.save();

    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
