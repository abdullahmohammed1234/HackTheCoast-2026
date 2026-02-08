import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Listing from '@/models/Listing';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const moveOutMode = searchParams.get('moveOutMode') === 'true';
    const search = searchParams.get('search');

    const query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (location && location !== 'all') {
      query.location = location;
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

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const listings = await Listing.find(query)
      .populate('userId', 'name email')
      .populate('bundleId', 'title')
      .sort({ createdAt: -1 });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await req.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'location', 'availableDate', 'imageUrl'];
    for (const field of requiredFields) {
      if (!data[field]) {
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

    const listing = await Listing.create({
      title: data.title,
      description: data.description,
      price: data.price ? parseFloat(data.price) : null,
      isFree: data.isFree || false,
      isTrade: data.isTrade || false,
      category: data.category,
      location: data.location,
      availableDate: new Date(data.availableDate),
      imageUrl: data.imageUrl,
      userId: session.user.id,
      isMoveOutBundle: data.isMoveOutBundle || false,
    });

    await listing.populate('userId', 'name email');

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: any) {
    console.error('Create listing error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
