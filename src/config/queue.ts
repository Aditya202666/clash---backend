import { DefaultJobOptions } from 'bullmq';
import  RedisModule from 'ioredis';

const Redis = RedisModule.default;

export const redisConnection = new Redis({
    
  host: process.env.REDIS_HOST,
  port: 6379,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_TOKEN,
  tls: {},
  maxRetriesPerRequest: null
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
    },
    removeOnFail: false
}