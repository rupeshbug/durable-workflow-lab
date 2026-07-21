import { Worker } from "bullmq";
import { redis } from "./lib/redis";

const worker = new Worker(
  "workflow",
  async (job) => {
    console.log("\n==========================");
    console.log("🚀 Processing Job");
    console.log("==========================");

    console.log("Job ID:", job.id);
    console.log("Job Name:", job.name);
    console.log("Data:", job.data);

    console.log("🤖 Pretending to call an LLM...");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("✅ AI Response: Hello");

    return {
      response: "Hello",
    };
  },
  {
    connection: redis,
  },
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job ${job?.id} failed`);
  console.error(err);
});

console.log("👷 Worker started...");
