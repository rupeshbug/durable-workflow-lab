import { serve } from "@hono/node-server";
import app from "./app";
import "./lib/redis";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
