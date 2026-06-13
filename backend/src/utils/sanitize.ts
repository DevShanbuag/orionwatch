
/**
 * Sanitizes user input to prevent XSS and other injection attacks
 * @param input The input string to sanitize
 * @returns The sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  // Trim whitespace
  let sanitized = input.trim();

  // Remove specific dangerous characters
  sanitized = sanitized
    .replace(/[<>"'`]/g, '');

  // Remove potentially dangerous protocols
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');

  // Limit to 255 characters
  sanitized = sanitized.slice(0, 255);

  return sanitized;
}

/**
 * Recursively sanitizes all string properties in an object
 * @param obj The object to sanitize
 * @returns A new object with sanitized strings
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const sanitized: Record<string, any> = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
