import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    // Redis doc: https://redis.io/docs/latest/commands/set/

    constructor(
        @Inject('RedisClient') private readonly redisClient: Redis,
    ) { }

    async get(key: string): Promise<string | null> {
        try {
            return this.redisClient.get(key);
        } catch (error) {
            throw new Error('Redis failed to get activation key');
        }
    }

    async set(key: string, value: string, expiry?: number): Promise<'OK'> {
        try {
            if (expiry) {
                return this.redisClient.set(key, value, 'EX', expiry);
            }
            return this.redisClient.set(key, value);
        } catch (error) {
            throw new Error('Redis failed to set activation key');
        }
    }

    async del(key: string): Promise<number> {
        try {
            return this.redisClient.del(key);
        } catch (error) {
            throw new Error('Redis failed to delete activation key');
        }
    }

    // Returns if key exists
    async exists(key: string): Promise<number> {
        return this.redisClient.exists(key);
    }

    // Set a timeout on key
    async expire(key: string, seconds: number): Promise<number> {
        return this.redisClient.expire(key, seconds);
    }

    // Returns the remaining time to live of a key
    async ttl(key: string): Promise<number> {
        return this.redisClient.ttl(key);
    }

    // Find all keys matching the specified pattern
    async scan(pattern: string, count = 100): Promise<string[]> {
        try {
            const matchingKeys: string[] = [];
            let cursor = '0';

            do {
                // Execute SCAN command using Redis pipeline
                const [newCursor, keys] = await this.redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', count);

                // Update cursor for next iteration
                cursor = newCursor;

                // Add found keys to result array
                matchingKeys.push(...keys);

            } while (cursor !== '0'); // Continue until cursor returns to 0

            return matchingKeys;
        } catch (error) {
            throw new Error(`Redis scan failed: ${error.message}`);
        }
    }
}
