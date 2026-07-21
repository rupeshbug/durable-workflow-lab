import { Hono } from "hono";

export const healthRouter = new Hono();

healthRouter.get("/", (c) => {
  return c.json({
    status: "healthy",
    service: "durable-workflow-lab",
    timestamp: new Date().toISOString(),
  });
});
