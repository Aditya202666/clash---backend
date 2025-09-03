import { Queue, QueueEvents, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import prisma from "../config/database.js";
export const commentQueueName = "commentQueue";
export const commentQueue = new Queue(commentQueueName, {
    connection: redisConnection,
    defaultJobOptions: {
        ...defaultQueueOptions,
        delay: 500,
    },
});
export const queueWorker = new Worker(commentQueueName, async (job) => {
    const data = job.data;
    // console.log(data, "job data");
    const comment = await prisma.clashComment.create({
        data: {
            clash_id: data.id,
            comment: data.comment
        },
        select: {
            id: true,
            comment: true,
            created_at: true
        }
    });
    // console.log(comment)
    return comment;
}, {
    connection: redisConnection,
});
export const commentQueueEvents = new QueueEvents(commentQueueName, {
    connection: redisConnection,
});
