import { Hono } from 'hono';
import { AuthRepository } from '../repositories/AuthRepository';
import { authEventIdSchema, loginSchema } from '../validators/auth';
import { tokenService } from '../services/token.service';
import bcrypt from 'bcryptjs';

// Mock user store (would be replaced with database in production)
interface MockUser {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  refreshTokenHash?: string;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'admin',
    passwordHash: '$2b$12$0TnzWRUJjlUD2m2lUy42QOTv/gQCcGewnc.P69IM69n4ffCflsfXK', // "password123"
    role: 'admin'
  },
  {
    id: '2',
    username: 'user',
    passwordHash: '$2b$12$0TnzWRUJjlUD2m2lUy42QOTv/gQCcGewnc.P69IM69n4ffCflsfXK',
    role: 'user'
  }
];

const authRepository = new AuthRepository();
const authRoutes = new Hono();

// POST /api/auth/login
authRoutes.post('/login', async (c) => {
  try {
    // 1. Validate input
    const body = await c.req.json();
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      const error = validationResult.error.issues[0]?.message || 'Invalid request';
      return c.json({ success: false, message: error }, 400);
    }
    const { username, password } = validationResult.data;

    // 2. Find user
    const user = mockUsers.find(u => u.username === username);
    if (!user) {
      return c.json(
        { success: false, message: 'Invalid credentials' },
        401
      );
    }

    // 3. Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return c.json(
        { success: false, message: 'Invalid credentials' },
        401
      );
    }

    // 4. Generate tokens
    const accessToken = await tokenService.generateAccessToken({
      sub: user.id,
      username: user.username,
      role: user.role
    });

    const refreshToken = tokenService.generateRefreshToken(user.id);
    const refreshTokenHash = await tokenService.hashRefreshToken(refreshToken);

    // 5. Store refresh token hash
    user.refreshTokenHash = refreshTokenHash;

    // 6. Set secure cookie
    c.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/api/auth/refresh',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // 7. Return access token
    return c.json({
      success: true,
      data: {
        accessToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json(
      { success: false, message: 'Internal server error' },
      500
    );
  }
});

// POST /api/auth/refresh
authRoutes.post('/refresh', async (c) => {
  try {
    // 1. Read refresh token from cookie
    const refreshToken = c.req.cookie('refreshToken');
    if (!refreshToken) {
      return c.json(
        { success: false, message: 'Unauthorized: Missing refresh token' },
        401
      );
    }

    // 2. Extract user ID from refresh token
    const parts = refreshToken.split('.');
    if (parts.length !== 2) {
      return c.json(
        { success: false, message: 'Unauthorized: Invalid refresh token' },
        401
      );
    }
    const userId = parts[0];

    // 3. Find user
    const user = mockUsers.find(u => u.id === userId);
    if (!user || !user.refreshTokenHash) {
      return c.json(
        { success: false, message: 'Unauthorized: Invalid refresh token' },
        401
      );
    }

    // 4. Verify refresh token
    const isValid = await tokenService.verifyRefreshToken(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      // Invalidate token on failed verification
      user.refreshTokenHash = undefined;
      return c.json(
        { success: false, message: 'Unauthorized: Invalid refresh token' },
        401
      );
    }

    // 5. Invalidate old token
    user.refreshTokenHash = undefined;

    // 6. Generate new tokens
    const newAccessToken = await tokenService.generateAccessToken({
      sub: user.id,
      username: user.username,
      role: user.role
    });

    const newRefreshToken = tokenService.generateRefreshToken(user.id);
    const newRefreshTokenHash = await tokenService.hashRefreshToken(newRefreshToken);

    // 7. Store new hash
    user.refreshTokenHash = newRefreshTokenHash;

    // 8. Set new secure cookie
    c.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/api/auth/refresh',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // 9. Return new access token
    return c.json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return c.json(
      { success: false, message: 'Internal server error' },
      500
    );
  }
});

// POST /api/auth/logout
authRoutes.post('/logout', async (c) => {
  try {
    // 1. Read refresh token from cookie
    const refreshToken = c.req.cookie('refreshToken');
    if (refreshToken) {
      // 2. Extract user ID and invalidate token
      const parts = refreshToken.split('.');
      if (parts.length === 2) {
        const userId = parts[0];
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          user.refreshTokenHash = undefined;
        }
      }
    }

    // 3. Clear cookie
    c.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/api/auth/refresh',
      maxAge: 0, // Expire immediately
      expires: new Date(0)
    });

    // 4. Return success
    return c.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json(
      { success: false, message: 'Internal server error' },
      500
    );
  }
});

// Existing routes
authRoutes.get('/events', async (c) => {
  const events = await authRepository.getAll();
  return c.json({
    success: true,
    data: events
  });
});

authRoutes.get('/events/:id', async (c) => {
  const id = c.req.param('id');
  const validationResult = authEventIdSchema.safeParse(id);
  if (!validationResult.success) {
    const error = validationResult.error.issues[0]?.message || 'Invalid request';
    return c.json({ success: false, message: error }, 400);
  }
  const event = await authRepository.getById(id);
  if (!event) {
    return c.json({ success: false, message: 'Auth event not found' }, 404);
  }
  return c.json({
    success: true,
    data: event
  });
});

export default authRoutes;
