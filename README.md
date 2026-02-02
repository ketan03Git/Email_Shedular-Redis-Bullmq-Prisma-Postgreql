# Email Scheduler-Backend(Node.js, TypeScript, Express, BullMQ, Redis, and PostgreSQL)
- Schedule emails for future delivery
- Persistent scheduling using BullMQ delayed jobs
- Restart-safe (jobs survive server restarts)
- No cron jobs used
- Idempotent email sending (no duplicates)
# Email Sending
- Uses Ethereal Email (fake SMTP) for safe testing
- Preview emails without real delivery
 # Tech Stack
- API: TypeScript
- API: Express.js
- Queue: BullMQ
- Cache: Redis 7
- Database: PostgreSQL
- ORM: Prisma
- SMTP: Nodemailer + Ethereal
  # Database Schema
  Represents a batch of scheduled emails
  - subject
  - body
  - start time
  - delay between emails
  - hourly limit
  # Email
  - scheduled time
  - sent time
  - status (scheduled | sent | failed)
  - unique job ID (idempotency)
  - 
 # Start PostgreSQL & Redis
  - docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
  - docker run -d -p 6379:6379 redis:7
 # Run Database Migrations
- npx prisma migrate dev
 # Start API Server
- npm run dev - "http://localhost:4000"
 # Start Worker
- npm run worker
# Scheduling Emails
- POST /schedule
  
{

  "subject": "Hello",
  
  "body": "hello there!",
  
  "recipients": ["a@test.com", "b@test.com"],
  
  "startTime": "2026-02-02T12:00:00Z",
  
  "delaySeconds": 5,
  
  "hourlyLimit": 100
  
}

----------------------------------------------------------------------------------
