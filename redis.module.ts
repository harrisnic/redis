import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis, { RedisOptions } from 'ioredis';
import { preloadConfigData } from '../preloader.config';

@Module({
    providers: [
        RedisService,
        {
            provide: 'RedisClient',
            useFactory: () => {
                const redisTLS: string = preloadConfigData.redis.tls;
                const redisTLSValue: boolean = redisTLS.toLowerCase() === 'true'

                const redisOptions: RedisOptions = {
                    host: preloadConfigData.redis.host,
                    port: Number(preloadConfigData.redis.port),
                    db: Number(preloadConfigData.redis.db),
                    tls: redisTLSValue ? { rejectUnauthorized: false } : undefined,
                    retryStrategy: (times) => Math.min(times * 50, 2000),
                };

                const redisInstance = new Redis(redisOptions);

                redisInstance.on('connect', () => {
                    console.log('Redis client connected successfully');
                });

                redisInstance.on('error', (err) => {
                    console.error('Redis client error:', err);
                });

                return redisInstance;
            },
        },
    ],
    exports: [RedisService],
})

export class RedisModule {}
