import { Hono } from "hono";
import { workflowQueue } from "@durable-workflow-lab/bullmq";

export const workflowRouter = new Hono();

type CreateWorkflowRequest = {
  message: string;
  scheduleAt?: string;
};

workflowRouter.post("/", async (c) => {
  const body = (await c.req.json()) as CreateWorkflowRequest;

  console.log("Received workflow request", body);

  // calculate delay from scheduleAt received from the request
  const delay = body.scheduleAt
    ? Math.max(0, new Date(body.scheduleAt).getTime() - Date.now())
    : 0;

  if (delay > 0) {
    console.log(`⏰ Workflow scheduled in ${delay / 1000} seconds`);
  } else {
    console.log("🚀 Workflow queued immediately");
  }

  // save the job to Redis
  const job = await workflowQueue.add(
    "process-workflow",
    { message: body.message },
    { delay },
  );

  return c.json({
    success: true,
    jobId: job.id,
    status: delay > 0 ? "scheduled" : "queued",
    delay,
  });
});
