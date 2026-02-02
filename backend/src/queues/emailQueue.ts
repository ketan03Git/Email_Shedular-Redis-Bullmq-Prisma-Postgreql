import { Queue } from "bullmq";
import { redisConnection  } from "../redis/connection.js";

export const emailQueue = new Queue("email-queue", {
connection: redisConnection
});