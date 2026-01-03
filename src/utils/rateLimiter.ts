/**
 * Rate limiter for GitHub API requests
 * Uses sliding window to track requests and respect rate limits
 */

import logger from './logger.js';

export interface RateLimiterConfig {
  maxPerMinute: number;      // Max operations per minute (default: 15, each op = ~5 API calls)
  maxConcurrent: number;     // Max concurrent operations (default: 2)
  backoffBaseMs: number;     // Base delay for exponential backoff (default: 1000)
}

// Note: Each operation makes ~5 API calls (branch, commit, PR, merge, delete)
// GitHub's limit is 80 content-creating requests/minute
// We limit to 15 operations/minute (75 API calls) to stay safe
const DEFAULT_CONFIG: RateLimiterConfig = {
  maxPerMinute: 15,    // Operations per minute (× 5 API calls each = 75, under 80 limit)
  maxConcurrent: 2,    // Parallel operations
  backoffBaseMs: 1000,
};

/**
 * Sliding window rate limiter
 * Tracks request timestamps and enforces rate limits
 */
class RateLimiter {
  private config: RateLimiterConfig;
  private requestTimestamps: number[] = [];
  private activeRequests: number = 0;
  private waitQueue: Array<() => void> = [];

  constructor(config: Partial<RateLimiterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Clean up old timestamps outside the sliding window
   */
  private cleanupOldTimestamps(): void {
    const oneMinuteAgo = Date.now() - 60000;
    this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneMinuteAgo);
  }

  /**
   * Get current stats
   */
  getStats(): { requestsLastMinute: number; active: number; available: number } {
    this.cleanupOldTimestamps();
    return {
      requestsLastMinute: this.requestTimestamps.length,
      active: this.activeRequests,
      available: this.config.maxPerMinute - this.requestTimestamps.length,
    };
  }

  /**
   * Check if we can make a request right now
   */
  canProceed(): boolean {
    this.cleanupOldTimestamps();
    return (
      this.activeRequests < this.config.maxConcurrent &&
      this.requestTimestamps.length < this.config.maxPerMinute
    );
  }

  /**
   * Calculate wait time until next request slot is available
   */
  private getWaitTime(): number {
    this.cleanupOldTimestamps();

    // If under concurrent limit but at rate limit, wait for oldest to expire
    if (this.requestTimestamps.length >= this.config.maxPerMinute) {
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = (oldestTimestamp + 60000) - Date.now() + 100; // +100ms buffer
      return Math.max(0, waitTime);
    }

    // If at concurrent limit, return small wait for queue processing
    if (this.activeRequests >= this.config.maxConcurrent) {
      return 50;
    }

    return 0;
  }

  /**
   * Acquire a slot to make a request
   * Waits if necessary to respect rate limits
   */
  async acquire(): Promise<void> {
    while (!this.canProceed()) {
      const waitTime = this.getWaitTime();
      if (waitTime > 0) {
        logger.debug(`Rate limiter: waiting ${waitTime}ms (${this.requestTimestamps.length}/${this.config.maxPerMinute} requests)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        // Small yield to let other tasks complete
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    this.activeRequests++;
    this.requestTimestamps.push(Date.now());
  }

  /**
   * Release a slot after request completes
   */
  release(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);

    // Process next in queue if any
    const next = this.waitQueue.shift();
    if (next) {
      next();
    }
  }

  /**
   * Execute a function with rate limiting
   */
  async withLimit<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }

  /**
   * Handle rate limit error (429 response)
   * Returns delay in ms before retry
   */
  handleRateLimitError(retryAfter?: number, attempt: number = 1): number {
    if (retryAfter) {
      return retryAfter * 1000;
    }

    // Exponential backoff with jitter
    const baseDelay = this.config.backoffBaseMs;
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 1000;
    return Math.min(exponentialDelay + jitter, 60000); // Cap at 60 seconds
  }

  /**
   * Update config at runtime
   */
  updateConfig(config: Partial<RateLimiterConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Reset the rate limiter (clear all timestamps)
   */
  reset(): void {
    this.requestTimestamps = [];
    this.activeRequests = 0;
    this.waitQueue = [];
  }
}

// Global rate limiter instance
let globalRateLimiter: RateLimiter | null = null;

/**
 * Get or create the global rate limiter
 */
export function getRateLimiter(config?: Partial<RateLimiterConfig>): RateLimiter {
  if (!globalRateLimiter) {
    globalRateLimiter = new RateLimiter(config);
  } else if (config) {
    globalRateLimiter.updateConfig(config);
  }
  return globalRateLimiter;
}

/**
 * Reset the global rate limiter
 */
export function resetRateLimiter(): void {
  if (globalRateLimiter) {
    globalRateLimiter.reset();
  }
}

/**
 * Execute with rate limiting using global limiter
 */
export async function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  return getRateLimiter().withLimit(fn);
}

export { RateLimiter };
export default getRateLimiter;
