
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

export class OsintCacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes

  constructor(private ttl: number = 5 * 60 * 1000) {
    this.defaultTTL = ttl;
    // Cleanup every 10 minutes
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  private getKey(query: string, type: string): string {
    return `${type}:${query}`;
  }

  set(query: string, type: string, data: any, ttl?: number): void {
    const key = this.getKey(query, type);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(query: string, type: string): any | null {
    const key = this.getKey(query, type);
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  invalidate(query: string, type: string): void {
    const key = this.getKey(query, type);
    this.cache.delete(key);
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const osintCache = new OsintCacheService();
