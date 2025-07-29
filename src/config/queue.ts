import { DefaultJobOptions } from 'bullmq';
import * as RedisModule from 'ioredis';

const Redis = (RedisModule as any).default || RedisModule;

export const redisConnection = new Redis({
    
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_TOKEN,
});

export const defaultQueueOptions: DefaultJobOptions = {
    removeOnComplete: {
        count: 20,
        age: 60*60
    },
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 3000
    }
}