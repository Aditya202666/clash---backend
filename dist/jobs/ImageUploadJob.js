import { Queue, QueueEvents, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
export const imageUploadQueueName = "imageUploadQueue";
export const imageUploadQueue = new Queue(imageUploadQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueOptions,
});
export const queueWorker = new Worker(imageUploadQueueName, async (job) => {
    const data = job.data;
    const res = await uploadOnCloudinary(data.filePath);
    return res;
}, {
    connection: redisConnection,
});
// * queue events
export const imageUploadQueueEvents = new QueueEvents(imageUploadQueueName, {
    connection: redisConnection
});
