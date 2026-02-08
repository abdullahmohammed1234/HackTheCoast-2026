import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';

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
    const { reportedUserId, reportedListingId, reportType, reason, description } = body;

    // Validate required fields
    if (!reportType || !reason) {
      return NextResponse.json(
        { error: 'Report type and reason are required' },
        { status: 400 }
      );
    }

    // Validate that we have either a user or listing to report
    if (reportType === 'user' && !reportedUserId) {
      return NextResponse.json(
        { error: 'User ID is required for user reports' },
        { status: 400 }
      );
    }

    if (reportType === 'listing' && !reportedListingId) {
      return NextResponse.json(
        { error: 'Listing ID is required for listing reports' },
        { status: 400 }
      );
    }

    // Prevent reporting yourself
    if (reportedUserId === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot report yourself' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for duplicate reports (within last 24 hours)
    const existingReport = await Report.findOne({
      reporterId: session.user.id,
      reportType,
      ...(reportType === 'user' && { reportedUserId }),
      ...(reportType === 'listing' && { reportedListingId }),
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this content recently' },
        { status: 400 }
      );
    }

    const report = new Report({
      reporterId: session.user.id,
      reportedUserId: reportType === 'user' ? reportedUserId : undefined,
      reportedListingId: reportType === 'listing' ? reportedListingId : undefined,
      reportType,
      reason,
      description: description || '',
    });

    await report.save();

    return NextResponse.json(
      { message: 'Report submitted successfully. Thank you for keeping our community safe.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

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

    const reports = await Report.find({ reporterId: session.user.id })
      .sort({ createdAt: -1 })
      .populate('reportedUserId', 'name avatar')
      .populate('reportedListingId', 'title imageUrl')
      .lean();

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Fetch reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
