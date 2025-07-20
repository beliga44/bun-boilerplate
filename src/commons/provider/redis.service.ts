import Redis from 'ioredis';
import RedisConfig from '../config/redis.config';
import { singleton } from 'tsyringe';

@singleton()
export class RedisService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: RedisConfig.REDIS_HOST,
            port: RedisConfig.REDIS_PORT
        });

        console.log(
            `Connecting to Redis at ${RedisConfig.REDIS_HOST}:${RedisConfig.REDIS_PORT}`
        );

        this.redis.on('connect', () => console.log('Connected to Redis'));
        this.redis.on('error', (err) => console.error('Redis error:', err));
        this.redis.on('close', () => console.log('Redis connection closed'));
        this.redis.on('end', () => console.log('Redis connection closed'));
    }

    async set(key: string, value: string, ttl: number | null = null) {
        try {
            if (ttl) {
                await this.redis.set(key, value, 'EX', ttl);
            } else {
                await this.redis.set(key, value);
            }
        } catch (err) {
            console.error('Error setting key:', err);
            throw err;
        }
    }

    async get(key: string) {
        try {
            const value = await this.redis.get(key);
            return value;
        } catch (err) {
            console.error('Error fetching key:', err);
            throw err;
        }
    }

    async sadd(key: string, v: string) {
        try {
            const value = await this.redis.sadd(key, v);
        } catch (err) {
            console.error('Error fetching key:', err);
            throw err;
        }
    }

    async smembers(key: string) {
        try {
            const value = await this.redis.smembers(key);
            return value;
        } catch (err) {
            console.error('Error fetching key:', err);
            throw err;
        }
    }

    async del(key: string) {
        try {
            await this.redis.del(key);
        } catch (err) {
            console.error('Error deleting key:', err);
            throw err;
        }
    }

    close() {
        this.redis.disconnect();
        console.log('Redis connection closed');
    }
}
