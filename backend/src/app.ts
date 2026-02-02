import express from "express"
import { scheduleRouter } from "./routes/schedule.js";

export const app = express();

app.use(express.json());
app.use("/schedule", scheduleRouter);