/**
 * Simple in-memory token-bucket used to rate limit bursty endpoints
 * (currently just the Gemini AI coach). For multi-instance deployments
 * swap this for a Redis-backed limiter.
 */
class TokenBucket {
    private capacity: number;
    private refillRate: number;
    private tokens: number;
    private lastRefill: number;

    constructor(capacity: number, refillRate: number) {
        this.capacity = capacity; // max burst size
        this.refillRate = refillRate; // tokens added per second
        this.lastRefill = Date.now();
        this.tokens = capacity;
    }

    private refill(): void {
        const now = Date.now();
        const secondsElapsed = (now - this.lastRefill) / 1000;
        const tokensToAdd = secondsElapsed * this.refillRate;

        this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }

    tryConsume(amount = 1): boolean {
        this.refill();

        if (this.tokens >= amount) {
            this.tokens -= amount;
            return true;
        }
        return false;
    }
}

export default TokenBucket;
