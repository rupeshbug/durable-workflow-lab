import { Worker } from "bullmq";
import { redis, WorkflowRunner } from "@durable-workflow-lab/bullmq";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const saveConversation = async () => {
  console.log("Step 1 - Save Conversation");
  await sleep(5000);
};

const callLLM = async () => {
  console.log("Step 2 - Call LLM");
  await sleep(5000);
};

const searchProducts = async () => {
  console.log("Step 3 - Search Products");
  await sleep(5000);
};

const saveResponse = async () => {
  console.log("Step 4 - Save AI Response");
  await sleep(5000);
};

const sendReply = async () => {
  console.log("Step 5 - Send Reply");
  await sleep(5000);
};

const worker = new Worker(
  "workflow",
  async (job) => {
    console.log("\n================================");
    console.log(`Processing Job ${job.id}`);
    console.log("================================");

    const runner = new WorkflowRunner(job.id!.toString());

    await runner.run([
      saveConversation,
      callLLM,
      searchProducts,
      saveResponse,
      sendReply,
    ]);
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

console.log("Worker Ready!");
