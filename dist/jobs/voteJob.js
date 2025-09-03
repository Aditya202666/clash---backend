import { Queue, QueueEvents, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import prisma from "../config/database.js";
export const voteQueueName = "voteQueue";
export const voteQueue = new Queue(voteQueueName, {
    connection: redisConnection,
    defaultJobOptions: {
        ...defaultQueueOptions,
        delay: 500,
    },
});
export const queueWorker = new Worker(voteQueueName, async (job) => {
    const data = job.data;
    // console.log(data, "job data");
    const vote = await prisma.clashItem.update({
        where: {
            id: data.id,
        },
        data: {
            likes: {
                increment: 1,
            },
        },
        select: {
            id: true,
            likes: true,
            image_url: true,
        },
    });
    // console.log(vote);
    if (!vote) {
        throw new Error("Clash item not found");
    }
    return vote;
}, {
    connection: redisConnection,
});
export const voteQueueEvents = new QueueEvents(voteQueueName, {
    connection: redisConnection,
});
