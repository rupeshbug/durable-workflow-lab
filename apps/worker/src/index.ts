import { Worker } from "bullmq";
import {
  redis,
  WorkflowExecutionContext,
  WorkflowRunner,
} from "@durable-workflow-lab/bullmq";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const saveConversation = async () => {
  console.log("Step 1 - Save Conversation");
  await sleep(5000);
};

const searchQuery = async (ctx: WorkflowExecutionContext) => {
  console.log("Step 2 - Search Query");

  await sleep(5000);

  ctx.context.searchQuery = "Find me red Nike shoes";

  console.log("Search Query:", ctx.context.searchQuery);
};

const searchProducts = async (ctx: WorkflowExecutionContext) => {
  console.log("Step 3 - Search Products");

  console.log("Searching for:", ctx.context.searchQuery);

  await sleep(5000);

  ctx.context.products = ["Nike Air Max", "Nike Pegasus"];
};

const saveResponse = async (ctx: WorkflowExecutionContext) => {
  console.log("Step 4 - Save AI Response");

  console.log("Saving:", ctx.context.products);

  await sleep(5000);
};

const sendReply = async (ctx: WorkflowExecutionContext) => {
  console.log("Step 5 - Send Reply");

  console.log(`Reply: I found ${ctx.context.products?.join(", ")}`);

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
      searchQuery,
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
