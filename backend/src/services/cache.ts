
import { supabase } from '../config/database';

interface CacheEntry {
  id: string;
  cache_key: string;
  source: string;
  response: unknown;
  expires_at: string;
  created_at: string;
}

// TTL rules in milliseconds
const TTL_RULES = {
  abuseipdb: 60 * 60 * 1000, // 1 hour
  virustotal: 6 * 60 * 60 * 1000, // 6 hours
  'alienvault-otx': 30 * 60 * 1000, // 30 minutes
  default: 5 * 60 * 1000, // 5 minutes default
};

export class ThreatCache {
  /**
   * Get TTL for a source
   */
  private getTTL(source: string): number {
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('abuseipdb')) {
      return TTL_RULES.abuseipdb;
    } else if (lowerSource.includes('virustotal')) {
      return TTL_RULES.virustotal;
    } else if (lowerSource.includes('alienvault') || lowerSource.includes('otx')) {
      return TTL_RULES['alienvault-otx'];
    }
    return TTL_RULES.default;
  }

  /**
   * Check if cache entry is valid (not expired)
   */
  async isCacheValid(cacheKey: string): Promise<boolean> {
    const now = new Date();
    const { data, error } = await supabase
      .from('threat_cache')
      .select('expires_at')
      .eq('cache_key', cacheKey)
      .single();

    if (error) {
      return false;
    }

    return new Date(data?.expires_at) > now;
  }

  /**
   * Get a cached response
   */
  async getCachedResponse(cacheKey: string): Promise<unknown | null> {
    const now = new Date();
    
    // Query cache
    const { data, error } = await supabase
      .from('threat_cache')
      .select('*')
      .eq('cache_key', cacheKey)
      .gt('expires_at', now.toISOString())
      .single();

    if (error) {
      console.warn('[ThreatCache] Error fetching cache:', error);
      return null;
    }

    return data?.response ?? null;
  }

  /**
   * Set a cached response
   */
  async setCachedResponse(cacheKey: string, source: string, response: unknown, ttl?: number): Promise<void> {
    const expiresAt = new Date(Date.now() + (ttl ?? this.getTTL(source)));

    const { error } = await supabase
      .from('threat_cache')
      .upsert({
        cache_key: cacheKey,
        source,
        response,
        expires_at: expiresAt.toISOString(),
      });

    if (error) {
      console.warn('[ThreatCache] Error setting cache:', error);
    }
  }

  /**
   * Get a cached value (kept for backward compatibility)
   */
  async get(cacheKey: string): Promise<unknown | null> {
    return this.getCachedResponse(cacheKey);
  }

  /**
   * Set a cached value (kept for backward compatibility)
   */
  async set(cacheKey: string, source: string, response: unknown, ttl?: number): Promise<void> {
    return this.setCachedResponse(cacheKey, source, response, ttl);
  }

  /**
   * Invalidate a specific cache entry
   */
  async invalidate(cacheKey: string): Promise<void> {
    const { error } = await supabase
      .from('threat_cache')
      .delete()
      .eq('cache_key', cacheKey);

    if (error) {
      console.warn('[ThreatCache] Error invalidating cache:', error);
    }
  }

  /**
   * Invalidate all cache entries for a source
   */
  async invalidateBySource(source: string): Promise<void> {
    const { error } = await supabase
      .from('threat_cache')
      .delete()
      .eq('source', source);

    if (error) {
      console.warn('[ThreatCache] Error invalidating by source:', error);
    }
  }

  /**
   * Cleanup expired cache entries
   */
  async cleanup(): Promise<void> {
    const now = new Date();
    const { error } = await supabase
      .from('threat_cache')
      .delete()
      .lt('expires_at', now.toISOString());

    if (error) {
      console.warn('[ThreatCache] Error cleaning up cache:', error);
    }
  }
}

// Export singleton instance
export const threatCache = new ThreatCache();
