import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Block from '@/models/Block';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';

// GET - Fetch all blocked users
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, rateLimitConfigs.api);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    const blocks = await Block.find({ blockerId: session.user.id })
      .sort({ createdAt: -1 })
      .populate('blockedId', 'name avatar email')
      .lean();

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('Fetch blocks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocked users' },
      { status: 500 }
    );
  }
}

// POST - Block a user
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, rateLimitConfigs.api);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { blockedId, reason } = body;

    // Validate required fields
    if (!blockedId) {
      return NextResponse.json(
        { error: 'User ID to block is required' },
        { status: 400 }
      );
    }

    // Prevent blocking yourself
    if (blockedId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot block yourself' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if already blocked
    const existingBlock = await Block.findOne({
      blockerId: session.user.id,
      blockedId,
    });

    if (existingBlock) {
      return NextResponse.json(
        { error: 'User is already blocked' },
        { status: 400 }
      );
    }

    const block = new Block({
      blockerId: session.user.id,
      blockedId,
      reason: reason || '',
    });

    await block.save();

    await block.populate('blockedId', 'name avatar');

    return NextResponse.json(
      { message: 'User blocked successfully', block },
      { status: 201 }
    );
  } catch (error) {
    console.error('Block user error:', error);
    return NextResponse.json(
      { error: 'Failed to block user' },
      { status: 500 }
    );
  }
}

// DELETE - Unblock a user
export async function DELETE(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request, rateLimitConfigs.api);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blockedId = searchParams.get('userId');

    if (!blockedId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Block.findOneAndDelete({
      blockerId: session.user.id,
      blockedId,
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Block not found or already unblocked' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Unblock user error:', error);
    return NextResponse.json(
      { error: 'Failed to unblock user' },
      { status: 500 }
    );
  }
}
