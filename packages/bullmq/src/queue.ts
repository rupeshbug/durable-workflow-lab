import { Queue } from "bullmq";
import { redis } from "./redis";

export const workflowQueue = new Queue("workflow", {
  connection: redis,
});

console.log("Workflow queue initialized");
