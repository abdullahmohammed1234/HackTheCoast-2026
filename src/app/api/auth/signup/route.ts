import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { sanitizeString, sanitizeEmail } from '@/lib/sanitize';

export async function POST(req: NextRequest) {
  // Apply rate limiting for auth endpoints
  const rateLimitResult = rateLimit(req, rateLimitConfigs.auth);
  const response = NextResponse.next();
  
  response.headers.set('X-RateLimit-Limit', rateLimitConfigs.auth.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', (rateLimitConfigs.auth.maxRequests - 1).toString());
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Please try again in 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Sanitize inputs to prevent XSS attacks
    const sanitizedName = sanitizeString(name, { maxLength: 100, allowSpaces: true });
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPassword = sanitizeString(password, { maxLength: 100 });

    // Validate UBC email
    if (!sanitizedEmail || !sanitizedEmail.endsWith('@student.ubc.ca')) {
      return NextResponse.json(
        { error: 'Only @student.ubc.ca emails are allowed. CWL SSO mocked for hackathon.' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create user
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password: sanitizedPassword,
    });

    return NextResponse.json(
      { message: 'User created successfully', user: { id: user._id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
