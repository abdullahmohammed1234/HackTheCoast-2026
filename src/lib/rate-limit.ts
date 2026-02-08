import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
}

// Rate limit configurations for different endpoints
export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  default: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
  auth: { maxRequests: 5, windowMs: 900000 }, // 5 requests per 15 minutes (for auth endpoints)
  upload: { maxRequests: 10, windowMs: 600000 }, // 10 uploads per 10 minutes
  api: { maxRequests: 200, windowMs: 60000 }, // 200 API requests per minute
};

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = rateLimitConfigs.default
): { success: boolean; headers: Record<string, string> } {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  
  // Get existing record or create new one
  let record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + config.windowMs };
    rateLimitStore.set(key, record);
  } else {
    record.count++;
  }
  
  // Calculate remaining requests
  const remaining = Math.max(0, config.maxRequests - record.count);
  const resetTime = Math.ceil((record.resetTime - now) / 1000);
  
  // Add headers
  const headers = {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString(),
  };
  
  // Check if rate limit exceeded
  if (record.count > config.maxRequests) {
    return { success: false, headers };
  }
  
  return { success: true, headers };
}

export function withRateLimit(
  request: NextRequest,
  config?: RateLimitConfig
): NextResponse | null {
  const rateLimitResult = rateLimit(request, config);
  
  const response = NextResponse.next();
  
  // Set rate limit headers
  Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimitResult.headers['X-RateLimit-Reset'],
        },
      }
    );
  }
  
  return null; // Continue to next middleware/handler
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, record] of entries) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute
