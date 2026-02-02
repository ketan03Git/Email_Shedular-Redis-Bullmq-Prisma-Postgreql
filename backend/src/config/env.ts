import dotenv from "dotenv"
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  redisUrl: required("REDIS_URL"),
  databaseUrl: required("DATABASE_URL"),
  etherealUser: required("ETHEREAL_USER"),
  etherealPass: required("ETHEREAL_PASS"),
  workerConcurrency: Number(process.env.WORKER_CONCURRENCY ?? 5),
  emailsPerHour: Number(process.env.EMAILS_PER_HOUR ?? 200),
  minDelaySeconds: Number(process.env.MIN_DELAY_SECONDS ?? 2),

};