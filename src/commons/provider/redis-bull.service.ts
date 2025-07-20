import IORedis from 'ioredis';
import redisConfig from '../config/redis.config';

export const sharedRedis = new IORedis({
    host: redisConfig.REDIS_HOST,
    port: redisConfig.REDIS_PORT
});
