import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Listing from '@/models/Listing';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select('-password');
    const listings = await Listing.find({ userId: session.user.id }).sort({ createdAt: -1 });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      listings: listings.map(listing => ({
        id: listing._id.toString(),
        title: listing.title,
        description: listing.description,
        price: listing.price,
        isFree: listing.isFree,
        isTrade: listing.isTrade,
        category: listing.category,
        location: listing.location,
        imageUrl: listing.imageUrl,
        isMoveOutBundle: listing.isMoveOutBundle,
        createdAt: listing.createdAt,
      })),
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
