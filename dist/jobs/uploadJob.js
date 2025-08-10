import { Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
export const uploadQueueName = "uploadQueue";
export const uploadQueue = new Queue(uploadQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueOptions,
});
export const queueWorker = new Worker(uploadQueueName, async (job) => {
    const filePath = job.data;
    const Response = await uploadOnCloudinary(filePath);
    return Response;
}, {
    connection: redisConnection,
});
