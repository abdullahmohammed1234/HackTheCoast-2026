import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Listing from '@/models/Listing';
import Wishlist from '@/models/Wishlist';
import User from '@/models/User';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { sanitizeString, sanitizeUrl } from '@/lib/sanitize';
import { sendNewListingNotification, sendWishlistMatchNotification } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  // Apply rate limiting
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
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const moveOutMode = searchParams.get('moveOutMode') === 'true';
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const sortBy = searchParams.get('sortBy') || 'newest';

    const query: any = {};

    // Only show non-expired listings by default
    // Show listings where isExpired is false OR undefined (for backward compatibility)
    query.$or = [{ isExpired: false }, { isExpired: { $exists: false } }];

    if (category && category !== 'all') {
      query.category = category;
    }

    if (location && location !== 'all') {
      query.location = location;
    }

    if (condition && condition !== 'all') {
      query.condition = condition;
    }

    if (minPrice) {
      query.price = { ...query.price, $gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }

    if (moveOutMode) {
      query.isMoveOutBundle = true;
    }

    if (dateFrom) {
      query.availableDate = { ...query.availableDate, $gte: new Date(dateFrom) };
    }

    if (dateTo) {
      query.availableDate = { ...query.availableDate, $lte: new Date(dateTo) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Determine sort order
    let sortOptions: any = { createdAt: -1 };
    switch (sortBy) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'price-low':
        sortOptions = { price: 1, createdAt: -1 };
        break;
      case 'price-high':
        sortOptions = { price: -1, createdAt: -1 };
        break;
      case 'title':
        sortOptions = { title: 1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const listings = await Listing.find(query)
      .populate('userId', 'name email')
      .populate('bundleId', 'title')
      .sort(sortOptions);

    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Apply rate limiting
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

    const rawData = await req.json();

    // Sanitize inputs to prevent XSS attacks
    const data = {
      title: sanitizeString(rawData.title, { maxLength: 200, allowSpaces: true }),
      description: sanitizeString(rawData.description, { maxLength: 3000 }),
      category: sanitizeString(rawData.category, { maxLength: 50 }),
      location: sanitizeString(rawData.location, { maxLength: 50 }),
      availableDate: rawData.availableDate,
      imageUrl: sanitizeUrl(rawData.imageUrl),
      imageUrls: rawData.imageUrls || [],
      price: rawData.price,
      condition: rawData.condition || 'good',
      isFree: rawData.isFree || false,
      isTrade: rawData.isTrade || false,
      isMoveOutBundle: rawData.isMoveOutBundle || false,
      expiryDate: rawData.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
    };

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'location', 'availableDate', 'imageUrl'];
    for (const field of requiredFields) {
      if (!data[field as keyof typeof data]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Validate category and location against allowed values
    const validCategories = ['Dorm', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Appliances', 'Other'];
    const validLocations = ['Gage', 'Totem', 'Vanier', 'Orchard', 'Marine', 'Kitsilano', 'Thunderbird', 'Other'];

    if (!validCategories.includes(data.category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    if (!validLocations.includes(data.location)) {
      return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
    }

    // Validate price if not free or trade
    if (!data.isFree && !data.isTrade && (data.price === null || data.price === undefined || data.price === '')) {
      return NextResponse.json({ error: 'Price is required when not free or trade' }, { status: 400 });
    }

    // Validate condition
    const validConditions = ['new', 'like-new', 'good', 'fair', 'used'];
    if (data.condition && !validConditions.includes(data.condition)) {
      return NextResponse.json({ error: 'Invalid condition' }, { status: 400 });
    }

    const listing = await Listing.create({
      title: data.title,
      description: data.description,
      price: data.price ? parseFloat(data.price) : null,
      isFree: data.isFree,
      isTrade: data.isTrade,
      category: data.category,
      location: data.location,
      condition: data.condition,
      availableDate: new Date(data.availableDate),
      expiryDate: new Date(data.expiryDate),
      imageUrl: data.imageUrl,
      imageUrls: data.imageUrls,
      userId: session.user.id,
      isMoveOutBundle: data.isMoveOutBundle,
    });

    await listing.populate('userId', 'name email');

    // Notify users with wishlist items in the same category
    const wishlists = await Wishlist.find({
      'items.listingId': { $exists: true }
    }).populate({
      path: 'items.listingId',
      select: 'category'
    });

    const notifiedUsers = new Set<string>();
    
    for (const wishlist of wishlists) {
      const userId = wishlist.userId.toString();
      
      // Don't notify the listing creator
      if (userId === session.user.id) continue;
      
      // Don't notify the same user twice
      if (notifiedUsers.has(userId)) continue;
      
      // Check if any of user's wishlist items are in the same category
      const wishlistItems = wishlist.items as any[];
      const hasMatchingCategory = wishlistItems.some(
        item => item.listingId?.category === data.category
      );
      
      if (hasMatchingCategory) {
        const user = await User.findById(userId);
        if (user?.notificationPreferences?.wishlistMatchNotifications) {
          sendWishlistMatchNotification(
            userId,
            data.title,
            data.price ? parseFloat(data.price) : 0,
            listing._id.toString()
          ).catch(console.error);
        }
        notifiedUsers.add(userId);
      }
    }

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: any) {
    console.error('Create listing error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
