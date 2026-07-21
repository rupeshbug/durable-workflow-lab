import { Hono } from "hono";
import { workflowQueue } from "@durable-workflow-lab/bullmq";

export const workflowRouter = new Hono();

workflowRouter.post("/", async (c) => {
  const body = await c.req.json();

  console.log("Received workflow request");
  console.log("This is the body", body);

  // save the job inside Redis
  const job = await workflowQueue.add("process-workflow", {
    message: body.message,
  });

  return c.json({
    success: true,
    jobId: job.id,
    state: "queued",
  });
});
