import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Maximum avatar size (5MB)
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { avatar } = await req.json();

    if (!avatar) {
      return NextResponse.json({ error: 'Avatar data is required' }, { status: 400 });
    }

    // Validate base64 data URL format
    if (!avatar.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    // Calculate size (base64 is approximately 33% larger than binary)
    const base64Length = avatar.split(',')[1]?.length || 0;
    const sizeInBytes = (base64Length * 3) / 4;

    if (sizeInBytes > MAX_AVATAR_SIZE) {
      return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { avatar },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      avatar: user.avatar 
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { avatar: '' },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      avatar: '' 
    });
  } catch (error) {
    console.error('Error removing avatar:', error);
    return NextResponse.json({ error: 'Failed to remove avatar' }, { status: 500 });
  }
}
