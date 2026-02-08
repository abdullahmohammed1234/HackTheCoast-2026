import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { status, meetupDate, meetupLocation } = body;

    const transaction = await Transaction.findById(params.id);
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Check if user is part of the transaction
    if (transaction.buyerId.toString() !== session.user.id && 
        transaction.sellerId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update fields
    if (status) {
      transaction.status = status;
      if (status === 'completed') {
        transaction.completedAt = new Date();
      }
    }
    
    if (meetupDate) {
      transaction.meetupDate = meetupDate;
    }
    
    if (meetupLocation) {
      transaction.meetupLocation = meetupLocation;
    }

    await transaction.save();

    return NextResponse.json({ 
      success: true,
      transaction: {
        _id: transaction._id.toString(),
        status: transaction.status,
        meetupDate: transaction.meetupDate,
        meetupLocation: transaction.meetupLocation
      }
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const transaction = await Transaction.findById(params.id)
      .populate('listingId', 'title imageUrl price description')
      .populate('buyerId', 'name email avatar rating')
      .populate('sellerId', 'name email avatar rating')
      .lean();

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Check if user is part of the transaction
    if (transaction.buyerId._id.toString() !== session.user.id && 
        transaction.sellerId._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}
