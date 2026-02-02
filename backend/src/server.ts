import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";


app.listen(env.port, () => {
    console.log(`API running on port: http://localhost:${env.port}/schedule`);
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.get("/health/db", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ db: "connected" });
});
import { redisClient } from "./redis/client.js";

app.get("/health/redis", async (_req, res) => {
  await redisClient.ping();
  res.json({ redis: "connected" });
});

