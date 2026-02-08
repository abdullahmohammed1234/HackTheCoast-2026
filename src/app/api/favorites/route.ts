import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import User from '@/models/User';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { sanitizeString } from '@/lib/sanitize';

// GET - Get user's favorite sellers
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

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || session.user.id;

    const favorites = await Favorite.find({ userId })
      .populate('favoriteUserId', 'name avatar rating badges followersCount sustainableListings');

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add a favorite seller
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

    const rawData = await req.json();
    const favoriteUserId = sanitizeString(rawData.favoriteUserId, { maxLength: 50 });

    if (!favoriteUserId) {
      return NextResponse.json({ error: 'Favorite user ID is required' }, { status: 400 });
    }

    // Can't follow yourself
    if (favoriteUserId === session.user.id) {
      return NextResponse.json({ error: 'You cannot follow yourself' }, { status: 400 });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      userId: session.user.id,
      favoriteUserId,
    });

    if (existingFavorite) {
      return NextResponse.json({ error: 'You are already following this user' }, { status: 400 });
    }

    // Create the favorite
    const favorite = await Favorite.create({
      userId: session.user.id,
      favoriteUserId,
    });

    // Update follower/following counts
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { followingCount: 1 },
    });

    await User.findByIdAndUpdate(favoriteUserId, {
      $inc: { followersCount: 1 },
    });

    // Check for badge eligibility
    await checkCommunityStarBadge(favoriteUserId);

    await favorite.populate('favoriteUserId', 'name avatar rating badges followersCount');

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error('Create favorite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove a favorite seller
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
    const favoriteUserId = searchParams.get('favoriteUserId');

    if (!favoriteUserId) {
      return NextResponse.json({ error: 'Favorite user ID is required' }, { status: 400 });
    }

    const favorite = await Favorite.findOneAndDelete({
      userId: session.user.id,
      favoriteUserId,
    });

    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    // Update follower/following counts
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { followingCount: -1 },
    });

    await User.findByIdAndUpdate(favoriteUserId, {
      $inc: { followersCount: -1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete favorite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to check Community Star badge
async function checkCommunityStarBadge(userId: string) {
  const user = await User.findById(userId);
  if (!user) return;

  if (user.followersCount >= 50 && !user.badges.includes('Community Star')) {
    await User.findByIdAndUpdate(userId, {
      $push: { badges: 'Community Star' },
    });
  }
}
