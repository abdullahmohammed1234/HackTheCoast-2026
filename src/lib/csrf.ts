/**
 * CSRF Protection Utility
 * Provides CSRF token generation and validation
 */

import { cookies } from 'next/headers';

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined') {
    crypto.getRandomValues(array);
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Set CSRF token as a cookie
 */
export function setCSRFCookie(): string {
  const token = generateCSRFToken();
  cookies().set('csrf_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
  return token;
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(requestToken: string | null): boolean {
  if (!requestToken) {
    return false;
  }

  try {
    const cookieToken = cookies().get('csrf_token')?.value;
    
    if (!cookieToken) {
      return false;
    }

    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(requestToken, cookieToken);
  } catch {
    return false;
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * CSRF protection for API routes
 */
export function createCSRFCheck(): (request: Request) => Response | null {
  return (request: Request) => {
    // Skip CSRF check for GET requests
    if (request.method === 'GET') {
      return null;
    }

    // Get CSRF token from header
    const requestToken = request.headers.get('x-csrf-token');
    
    if (!validateCSRFToken(requestToken)) {
      return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return null; // CSRF check passed
  };
}

/**
 * Get CSRF token for client-side use
 * Note: In production, you should use a more secure method
 */
export function getClientCSRFToken(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  
  // Get token from meta tag (set by server)
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (metaToken) {
    return metaToken;
  }
  
  // Fallback: generate a new token for this session
  return generateCSRFToken();
}
