import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { emailQueue } from "../queues/emailQueue.js";

export const scheduleRouter = Router();

scheduleRouter.post("/", async (req, res) => {
    const {
        subject,
        body,
        recipients,
        startTime,
        delaySeconds,
        hourlyLimit
    } = req.body;

    const campaign = await prisma.campaign.create({
        data: {
            subject,
            body,
            startTime: new Date(startTime),
            delaySeconds,
            hourlyLimit,
            status: "scheduled"
        }
    });

    for (let i = 0; i < recipients.length; i++) {
        const scheduledAt = new Date(
            new Date(startTime).getTime() + i *delaySeconds * 1000
        );

        const email = await prisma.email.create({
            data: {
                campaignId: campaign.id,
                recipient: recipients[i],
                scheduledAt,
                status: "scheduled",
                jobId: `email:${campaign.id}:${i}`
            }
        });

        await emailQueue.add(
            "send-email",
            { emailId: email.id },
            {
                delay: scheduledAt.getTime() - Date.now(),
                jobId: email.jobId
            }
        )
    };
})