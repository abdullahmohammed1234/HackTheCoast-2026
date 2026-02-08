import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';
import User from '@/models/User';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { sanitizeString } from '@/lib/sanitize';
import { sendNewMessageNotification } from '@/lib/notifications';

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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const conversationWith = searchParams.get('with');

    let query: any = {
      $or: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    };

    if (conversationWith) {
      query.$and = [
        {
          $or: [
            { senderId: session.user.id, receiverId: conversationWith },
            { senderId: conversationWith, receiverId: session.user.id },
          ],
        },
      ];
    }

    const messages = await Message.find(query)
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email')
      .populate('listingId', 'title')
      .sort({ createdAt: 1 });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
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
      receiverId: sanitizeString(rawData.receiverId, { maxLength: 50 }),
      listingId: sanitizeString(rawData.listingId, { maxLength: 50 }),
      content: sanitizeString(rawData.content, { maxLength: 2000 }),
    };

    // Validate required fields
    if (!data.receiverId) {
      return NextResponse.json({ error: 'Receiver ID is required' }, { status: 400 });
    }

    if (!data.content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const message = await Message.create({
      senderId: session.user.id,
      receiverId: data.receiverId,
      listingId: data.listingId || null,
      content: data.content,
    });

    await message.populate('senderId', 'name email');
    await message.populate('receiverId', 'name email');
    await message.populate('listingId', 'title');

    // Send push notification to receiver
    const senderName = (message.senderId as any).name || 'Someone';
    const messageId = message._id.toString();
    const conversationId = [session.user.id, data.receiverId].sort().join('-');

    // Get receiver's user document for notification preferences
    const receiverUser = await User.findById(data.receiverId);
    if (receiverUser && receiverUser.notificationPreferences?.newMessageNotifications) {
      sendNewMessageNotification(
        data.receiverId,
        senderName,
        data.content,
        messageId,
        conversationId
      ).catch(console.error);
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
