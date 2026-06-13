
import { Context, Next } from 'hono';
import { tokenService } from '../services/token.service';

// Extend Hono context to include user
declare module 'hono' {
  interface ContextVariableMap {
    user: {
      id: string;
      username: string;
      role: string;
    };
  }
}

/**
 * Authentication middleware
 * Verifies JWT access token from Authorization header
 * @param c Hono context
 * @param next Next function
 */
export async function authMiddleware(c: Context, next: Next) {
  // Get Authorization header
  const authHeader = c.req.header('Authorization');

  // Check if header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      { success: false, message: 'Unauthorized: Missing token' },
      401
    );
  }

  // Extract token
  const token = authHeader.slice(7); // Remove 'Bearer ' prefix

  try {
    // Verify token
    const payload = await tokenService.verifyAccessToken(token);

    // Attach user to context
    c.set('user', {
      id: payload.sub,
      username: payload.username,
      role: payload.role
    });

    // Proceed to next handler
    await next();
  } catch (error) {
    console.error('Auth error:', error);
    return c.json(
      { success: false, message: 'Unauthorized: Invalid or expired token' },
      401
    );
  }
}
