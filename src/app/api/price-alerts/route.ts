import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import PriceAlert from '@/models/PriceAlert';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';

// GET - Fetch user's price alerts
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

    const alerts = await PriceAlert.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Get price alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new price alert
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

    const { name, category, location, minPrice, maxPrice } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Alert name is required' }, { status: 400 });
    }

    // Validate category and location
    const validCategories = ['all', 'Dorm', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Appliances', 'Other'];
    const validLocations = ['all', 'Gage', 'Totem', 'Vanier', 'Orchard', 'Marine', 'Kitsilano', 'Thunderbird'];

    const alertCategory = validCategories.includes(category) ? category : 'all';
    const alertLocation = validLocations.includes(location) ? location : 'all';

    const alert = await PriceAlert.create({
      userId: session.user.id,
      name,
      category: alertCategory,
      location: alertLocation,
      minPrice: minPrice || 0,
      maxPrice: maxPrice || null,
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error('Create price alert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update a price alert
export async function PATCH(req: NextRequest) {
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

    const { alertId, ...updates } = await req.json();

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }

    const alert = await PriceAlert.findOne({ _id: alertId, userId: session.user.id });
    
    if (!alert) {
      return NextResponse.json({ error: 'Price alert not found' }, { status: 404 });
    }

    // Validate and apply updates
    const validCategories = ['all', 'Dorm', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Appliances', 'Other'];
    const validLocations = ['all', 'Gage', 'Totem', 'Vanier', 'Orchard', 'Marine', 'Kitsilano', 'Thunderbird'];

    if (updates.category && validCategories.includes(updates.category)) {
      alert.category = updates.category;
    }
    if (updates.location && validLocations.includes(updates.location)) {
      alert.location = updates.location;
    }
    if (updates.minPrice !== undefined) {
      alert.minPrice = updates.minPrice;
    }
    if (updates.maxPrice !== undefined) {
      alert.maxPrice = updates.maxPrice;
    }
    if (updates.isActive !== undefined) {
      alert.isActive = updates.isActive;
    }
    if (updates.name) {
      alert.name = updates.name;
    }

    await alert.save();

    return NextResponse.json({ alert });
  } catch (error) {
    console.error('Update price alert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a price alert
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
    const alertId = searchParams.get('alertId');

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }

    const result = await PriceAlert.deleteOne({ _id: alertId, userId: session.user.id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Price alert not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete price alert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
