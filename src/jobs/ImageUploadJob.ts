import { Job, Queue, QueueEvents, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { UploadApiResponse } from "cloudinary";

export const imageUploadQueueName = "imageUploadQueue";

export const imageUploadQueue = new Queue(imageUploadQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOptions,
});

interface imageUploadJobDataType {
  filePath: string;
}

export const queueWorker = new Worker(
  imageUploadQueueName,
  async (job: Job): Promise<UploadApiResponse | null> => {
    
    const data: imageUploadJobDataType = job.data;
    const res =  await uploadOnCloudinary(data.filePath);
    return res
  },
  {
    connection: redisConnection,
  }
);


// * queue events

export const imageUploadQueueEvents = new QueueEvents(imageUploadQueueName, {
    connection: redisConnection
})