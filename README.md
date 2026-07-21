# Durable Workflow Lab

A small learning project demonstrating how Redis and BullMQ can be used to build durable, resumable workflows in TypeScript.

The goal of this project is to understand the concepts behind workflow engines like Temporal, Inngest, and Trigger.dev before applying them to production systems.

## What You'll Learn

- Redis fundamentals
- BullMQ queues and workers
- Background job processing
- Workflow checkpoints
- Durable execution
- Workflow state persistence
- Crash recovery
- Shared workflow context between steps

## Tech Stack

- TypeScript
- Hono
- BullMQ
- Redis
- Docker
- TurboRepo

## Workflow

```
HTTP Request
      │
      ▼
Queue Job
      │
      ▼
Worker
      │
      ▼
Step 1 → Save Conversation
      │
      ▼
Step 2 → Generate Search Query
      │
      ▼
Step 3 → Search Products
      │
      ▼
Step 4 → Save Response
      │
      ▼
Step 5 → Send Reply
```

After every completed step, the workflow state and shared context are persisted to Redis. If the worker crashes, the workflow resumes from the last completed checkpoint instead of starting over.

## Running the Project

```bash
pnpm install
docker compose up -d
pnpm dev
```

Send a request:

```http
POST /workflow
```

## Crash Recovery Demo

1. Start the server and worker.
2. Create a workflow.
3. Wait until Step 2 completes.
4. Stop the worker (`Ctrl + C`).
5. Start the worker again.
6. Observe the workflow resuming from the last completed step.

## Project Structure

```
apps/
  server/
  worker/

packages/
  bullmq/
```

The shared BullMQ package contains:

- Redis connection
- Queue
- Workflow runner
- Workflow state management

Both the API server and the worker reuse this package.

## Notes

This project is intentionally simple and built for learning. It is **not** a production workflow engine, but it demonstrates the core ideas behind durable execution and long-running workflows.
