import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { healthRouter } from "./routes/health";
import { workflowRouter } from "./routes/workflow";

const app = new Hono();

app.use(logger());

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.route("/health", healthRouter);
app.route("/workflow", workflowRouter);

export default app;
