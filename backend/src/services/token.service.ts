
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

// Token payload interfaces
export interface AccessTokenPayload {
  sub: string;
  username: string;
  role: string;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string; // Unique token ID for single use tracking
}

// Token service class
export class TokenService {
  private secretKey: Uint8Array;
  private algorithm: string = 'HS256';
  private accessTokenExpiry: string;
  private refreshTokenExpiry: string;
  private saltRounds: number = 12;

  constructor() {
    // Use environment variable for secret key, or generate a default one (not production safe!)
    const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production-123456';
    this.secretKey = new TextEncoder().encode(secret);
    // Read expiry times from environment variables with defaults
    const accessExpiryMinutes = parseInt(process.env.ACCESS_TOKEN_EXPIRY_MINUTES || '15', 10);
    const refreshExpiryDays = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '7', 10);
    this.accessTokenExpiry = `${accessExpiryMinutes}m`;
    this.refreshTokenExpiry = `${refreshExpiryDays}d`;
  }

  /**
   * Generate an access token
   * @param payload The token payload
   * @returns The generated JWT token
   */
  async generateAccessToken(payload: AccessTokenPayload): Promise<string> {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: this.algorithm })
      .setIssuedAt()
      .setExpirationTime(this.accessTokenExpiry)
      .sign(this.secretKey);

    return token;
  }

  /**
   * Verify an access token
   * @param token The JWT token to verify
   * @returns The decoded token payload if valid
   * @throws Error if token is invalid or expired
   */
  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const { payload } = await jwtVerify(token, this.secretKey, {
      algorithms: [this.algorithm]
    });

    return payload as AccessTokenPayload;
  }

  /**
   * Generate a refresh token (raw) - this should be sent to the client only
   * @param sub The subject/user ID
   * @returns The raw refresh token
   */
  generateRefreshToken(sub: string): string {
    // Generate a secure random refresh token
    return `${sub}.${randomBytes(48).toString('hex')}`;
  }

  /**
   * Hash a refresh token for secure storage
   * @param refreshToken The raw refresh token
   * @returns The hashed refresh token
   */
  async hashRefreshToken(refreshToken: string): Promise<string> {
    return await bcrypt.hash(refreshToken, this.saltRounds);
  }

  /**
   * Verify a refresh token against its hash
   * @param refreshToken The raw refresh token
   * @param storedHash The stored hashed refresh token
   * @returns True if valid, false otherwise
   */
  async verifyRefreshToken(refreshToken: string, storedHash: string): Promise<boolean> {
    return await bcrypt.compare(refreshToken, storedHash);
  }
}

// Export a singleton instance
export const tokenService = new TokenService();
