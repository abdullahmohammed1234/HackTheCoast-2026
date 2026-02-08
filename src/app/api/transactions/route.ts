import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    let query: any = {};
    
    if (type === 'buyer') {
      query = { buyerId: session.user.id };
    } else if (type === 'seller') {
      query = { sellerId: session.user.id };
    } else if (type === 'all') {
      query = {
        $or: [
          { buyerId: session.user.id },
          { sellerId: session.user.id }
        ]
      };
    }

    const transactions = await Transaction.find(query)
      .populate('listingId', 'title imageUrl price')
      .populate('buyerId', 'name email avatar')
      .populate('sellerId', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Transform for frontend
    const transformedTransactions = transactions.map((t: any) => ({
      _id: t._id.toString(),
      listingId: {
        _id: t.listingId._id.toString(),
        title: t.listingId.title,
        imageUrl: t.listingId.imageUrl,
        price: t.listingId.price
      },
      buyerId: {
        _id: t.buyerId._id.toString(),
        name: t.buyerId.name,
        email: t.buyerId.email,
        avatar: t.buyerId.avatar
      },
      sellerId: {
        _id: t.sellerId._id.toString(),
        name: t.sellerId.name,
        email: t.sellerId.email,
        avatar: t.sellerId.avatar
      },
      finalPrice: t.finalPrice,
      type: t.type,
      status: t.status,
      meetupLocation: t.meetupLocation,
      meetupDate: t.meetupDate,
      completedAt: t.completedAt,
      createdAt: t.createdAt.toISOString()
    }));

    return NextResponse.json({ transactions: transformedTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { listingId, offerId, buyerId, sellerId, finalPrice, type } = body;

    // Create transaction record
    const transaction = await Transaction.create({
      listingId,
      offerId,
      buyerId,
      sellerId,
      finalPrice,
      type: type || 'sale',
      status: 'pending'
    });

    return NextResponse.json({ 
      transaction: {
        _id: transaction._id.toString(),
        status: transaction.status
      }
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
