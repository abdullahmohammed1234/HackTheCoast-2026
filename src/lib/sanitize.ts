/**
 * Input Sanitization Utility for XSS Prevention
 * Provides comprehensive sanitization for user inputs
 */

// Characters to escape for HTML
const htmlEscapeMap: Record<string, string> = {
  '&': '&',
  '<': '<',
  '>': '>',
  '"': '"',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Escape HTML special characters to prevent XSS attacks
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Sanitize a string by removing potentially dangerous characters and tags
 */
export function sanitizeString(str: string, options?: {
  maxLength?: number;
  allowAlphanumeric?: boolean;
  allowSpaces?: boolean;
  allowSpecialChars?: string[];
}): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  let sanitized = str;

  // Remove null bytes and control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Remove potential HTML/script tags
  sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed[^>]*>/gi, '');
  sanitized = sanitized.replace(/<link[^>]*>/gi, '');
  sanitized = sanitized.replace(/<meta[^>]*>/gi, '');
  sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '');
  
  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/javascript:[^\s>]*/gi, '');
  sanitized = sanitized.replace(/data:[^\s>]*/gi, '');
  
  // Remove CSS expressions
  sanitized = sanitized.replace(/expression\s*\([^)]*\)/gi, '');

  // Apply custom options
  if (options?.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.slice(0, options.maxLength);
  }

  if (options?.allowAlphanumeric) {
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  if (options?.allowSpaces === false) {
    sanitized = sanitized.replace(/\s/g, '');
  }

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize user input object recursively
 */
export function sanitizeInput<T extends Record<string, any>>(
  input: T,
  options?: {
    maxStringLength?: number;
    allowedFields?: (keyof T)[];
    fieldOptions?: Record<keyof T, Parameters<typeof sanitizeString>[1]>;
  }
): T {
  if (!input || typeof input !== 'object') {
    return {} as T;
  }

  const sanitized = { ...input };

  if (options?.allowedFields) {
    // Only sanitize specified fields
    for (const key of Object.keys(sanitized) as (keyof T)[]) {
      if (!options.allowedFields.includes(key)) {
        delete sanitized[key];
      }
    }
  }

  for (const key of Object.keys(sanitized) as (keyof T)[]) {
    const value = sanitized[key];

    if (typeof value === 'string') {
      const fieldOptions = options?.fieldOptions?.[key];
      sanitized[key] = sanitizeString(value, {
        maxLength: options?.maxStringLength ?? 10000,
        ...fieldOptions,
      }) as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeInput(value) as T[keyof T];
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }
  
  // Remove any potentially dangerous characters
  const sanitized = email.trim().toLowerCase().replace(/[^a-z0-9@._-]/g, '');
  
  // Validate format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }
  
  return sanitized;
}

/**
 * Sanitize URL to prevent URL injection
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  let sanitized = url.trim().toLowerCase();
  
  // Only allow http and https
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    sanitized = '';
  }
  
  // Remove potentially dangerous protocols
  sanitized = sanitized.replace(/javascript:[^\s>]*/gi, '');
  sanitized = sanitized.replace(/data:[^\s>]*/gi, '');
  sanitized = sanitized.replace(/vbscript:[^\s>]*/gi, '');
  
  return sanitized;
}

/**
 * Sanitize listing data for API submissions
 */
export function sanitizeListingData(data: Record<string, any>): Record<string, any> {
  return sanitizeInput(data, {
    maxStringLength: 5000,
    allowedFields: [
      'title',
      'description',
      'category',
      'location',
      'availableDate',
      'imageUrl',
      'price',
      'moveOutMode',
    ],
    fieldOptions: {
      title: { maxLength: 200, allowAlphanumeric: false, allowSpaces: true },
      description: { maxLength: 3000, allowAlphanumeric: false },
      category: { allowAlphanumeric: true },
      location: { allowAlphanumeric: true },
      availableDate: { allowAlphanumeric: false },
      imageUrl: {},
      price: { allowAlphanumeric: false },
      moveOutMode: { allowAlphanumeric: true },
    },
  });
}

/**
 * Sanitize message data for API submissions
 */
export function sanitizeMessageData(data: Record<string, any>): Record<string, any> {
  return sanitizeInput(data, {
    maxStringLength: 5000,
    allowedFields: ['content', 'receiverId', 'listingId'],
    fieldOptions: {
      content: { maxLength: 2000 },
      receiverId: { allowAlphanumeric: true },
      listingId: { allowAlphanumeric: true },
    },
  });
}
