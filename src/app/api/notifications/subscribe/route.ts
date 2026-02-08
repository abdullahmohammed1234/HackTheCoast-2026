import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import PushSubscription from '@/models/PushSubscription';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await request.json();

    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    await connectDB();

    // Upsert the subscription (update if exists, insert if new)
    await PushSubscription.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: 'Subscription saved' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    await connectDB();

    await PushSubscription.findOneAndDelete({
      userId: session.user.id,
      endpoint,
    });

    return NextResponse.json({ success: true, message: 'Subscription removed' });
  } catch (error) {
    console.error('Error removing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 }
    );
  }
}
