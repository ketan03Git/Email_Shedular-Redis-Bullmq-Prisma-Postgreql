console.log("REDIS_URL =", process.env.REDIS_URL);
console.log("NODE_ENV =", process.env.NODE_ENV);

import { Worker } from "bullmq"; 
import { redisConnection } from "../redis/connection.js";
import { redisClient } from "../redis/client.js";
import { prisma } from "../db/prisma.js";
import { smtpTransporter } from "../config/smtp.js";
import { emailQueue } from "../queues/emailQueue.js";
import { env } from "../config/env.js"
import "dotenv/config";

console.log("DATABASE_URL =", process.env.DATABASE_URL);

function hourKey(campaignId: string) {
  const hour = new Date().toISOString().slice(0, 13);
    return `rate:${campaignId}:${hour}`;
}

new Worker(
    "email-queue",
    async (job) => {
        const { emailId } = job.data;

        const email = await prisma.email.findUnique({
            where: { id: emailId },
            include: { campaign: true }
        });

        if(!email || email.status !== "scheduled") return;

    const key = hourKey(email.campaignId);
    const current = Number(await redisClient.get(key) || 0);

    if(current >= email.campaign.hourlyLimit) {
        const nextHour = new Date();
        nextHour.setMinutes(60, 0, 0);

        await emailQueue.add(
            "send-email",
            { emailId },
            {
                delay: nextHour.getTime() - Date.now(),
                jobId: email.jobId
            }
        );
        return;
    }

    await redisClient.incr(key);
    await redisClient.expire(key, 3600);

    try {
        await smtpTransporter.sendMail({
            to: email.recipient,
            subject: email.campaign.subject,
            text: email.campaign.body
        });

        await prisma.email.update({
            where: { id: emailId },
            data: { status: "sent", sentAt: new Date()}
        });
    }catch (err: any) {
        await prisma.email.update({
        where: { id: emailId },
            data: { status: "failed", error: err.message }
        });
    }
    },
    {
        connection: redisConnection ,
        concurrency: env.workerConcurrency,
        limiter: {
            max: 1,
            duration: env.minDelaySeconds * 1000
        }
    }
);

console.log("Email Worker started");