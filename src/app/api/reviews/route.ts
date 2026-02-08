import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { sanitizeString } from '@/lib/sanitize';

// GET - Get reviews for a user
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const reviews = await Review.find({ revieweeId: userId })
      .populate('reviewerId', 'name avatar')
      .populate('listingId', 'title imageUrl')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({ reviews, averageRating, totalReviews: reviews.length });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a review
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

    const data = {
      revieweeId: sanitizeString(rawData.revieweeId, { maxLength: 50 }),
      listingId: sanitizeString(rawData.listingId, { maxLength: 50 }),
      rating: Number(rawData.rating),
      comment: sanitizeString(rawData.comment, { maxLength: 1000 }),
      transactionType: rawData.transactionType,
    };

    // Validate required fields
    if (!data.revieweeId) {
      return NextResponse.json({ error: 'Reviewee ID is required' }, { status: 400 });
    }

    if (!data.listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (!data.transactionType || !['purchase', 'trade'].includes(data.transactionType)) {
      return NextResponse.json({ error: 'Valid transaction type is required' }, { status: 400 });
    }

    // Check if review already exists for this listing
    const existingReview = await Review.findOne({
      reviewerId: session.user.id,
      listingId: data.listingId,
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this listing' }, { status: 400 });
    }

    // Create the review
    const review = await Review.create({
      reviewerId: session.user.id,
      revieweeId: data.revieweeId,
      listingId: data.listingId,
      rating: data.rating,
      comment: data.comment,
      transactionType: data.transactionType,
    });

    // Update the reviewee's rating
    const allReviews = await Review.find({ revieweeId: data.revieweeId });
    const newAverageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await User.findByIdAndUpdate(data.revieweeId, {
      rating: Math.round(newAverageRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    // Check for badge eligibility
    await updateUserBadges(data.revieweeId);

    await review.populate('reviewerId', 'name avatar');
    await review.populate('listingId', 'title imageUrl');

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to update user badges
async function updateUserBadges(userId: string) {
  const user = await User.findById(userId);
  if (!user) return;

  const badges: string[] = [...user.badges];
  
  // Top Seller: 10+ sales with 4.5+ rating
  if (user.totalSales >= 10 && user.rating >= 4.5) {
    if (!badges.includes('Top Seller')) {
      badges.push('Top Seller');
    }
  }

  // Sustainable Hero: 20+ listings
  if (user.sustainableListings >= 20) {
    if (!badges.includes('Sustainable Hero')) {
      badges.push('Sustainable Hero');
    }
  }

  // Trusted Trader: 20+ reviews with 4.5+ rating
  if (user.reviewCount >= 20 && user.rating >= 4.5) {
    if (!badges.includes('Trusted Trader')) {
      badges.push('Trusted Trader');
    }
  }

  // Community Star: 50+ followers
  if (user.followersCount >= 50) {
    if (!badges.includes('Community Star')) {
      badges.push('Community Star');
    }
  }

  if (badges.length !== user.badges.length) {
    await User.findByIdAndUpdate(userId, { badges });
  }
}
