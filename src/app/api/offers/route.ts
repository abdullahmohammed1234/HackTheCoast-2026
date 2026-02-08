import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Offer from '@/models/Offer';
import Listing from '@/models/Listing';
import User from '@/models/User';
import { sendOfferNotification } from '@/lib/notifications';

// GET all offers for the current user (as buyer or seller)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all'; // 'received' | 'sent' | 'all'
    const status = searchParams.get('status'); // filter by status

    let query: any = {};

    if (type === 'received') {
      query.sellerId = session.user.id;
    } else if (type === 'sent') {
      query.buyerId = session.user.id;
    } else {
      query.$or = [{ buyerId: session.user.id }, { sellerId: session.user.id }];
    }

    if (status) {
      query.status = status;
    }

    const offers = await Offer.find(query)
      .populate('listingId', 'title price imageUrl imageUrls')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ offers });
  } catch (error) {
    console.error('Get offers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new offer
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { listingId, offeredPrice, message } = await req.json();

    if (!listingId || offeredPrice === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Get listing details
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if listing is expired
    if (listing.isExpired || new Date() > listing.expiryDate) {
      return NextResponse.json({ error: 'This listing has expired' }, { status: 400 });
    }

    // Check if user is not the seller
    if (listing.userId.toString() === session.user.id) {
      return NextResponse.json({ error: 'Cannot make an offer on your own listing' }, { status: 400 });
    }

    // Check for existing pending offer from this buyer on this listing
    const existingOffer = await Offer.findOne({
      listingId,
      buyerId: session.user.id,
      status: { $in: ['pending', 'countered'] },
    });

    if (existingOffer) {
      return NextResponse.json(
        { error: 'You already have a pending offer on this listing. Update it instead.' },
        { status: 400 }
      );
    }

    const offer = new Offer({
      listingId,
      buyerId: session.user.id,
      sellerId: listing.userId,
      offeredPrice,
      message,
    });

    await offer.save();

    // Send notification to seller
    const sellerUser = await User.findById(listing.userId);
    if (sellerUser && sellerUser.notificationPreferences?.offerNotifications) {
      sendOfferNotification(
        listing.userId.toString(),
        offeredPrice,
        listing.title,
        offer._id.toString(),
        listingId
      ).catch(console.error);
    }

    return NextResponse.json({ offer, message: 'Offer submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create offer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
