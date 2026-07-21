import { redis } from "./redis";

export interface WorkflowState {
  workflowId: string;
  currentStep: number;
  status: "running" | "completed";
}

export async function createWorkflow(workflowId: string) {
  await redis.hset(`workflow:${workflowId}`, {
    workflowId,
    currentStep: "0",
    status: "running",
  });

  console.log(`📌 Created workflow ${workflowId}`);
}

export async function getWorkflow(workflowId: string) {
  return await redis.hgetall(`workflow:${workflowId}`);
}

export async function updateStep(workflowId: string, currentStep: number) {
  await redis.hset(
    `workflow:${workflowId}`,
    "currentStep",
    currentStep.toString(),
  );

  console.log(`💾 Checkpoint -> Step ${currentStep}`);
}

export async function completeWorkflow(workflowId: string) {
  await redis.hset(`workflow:${workflowId}`, "status", "completed");

  console.log("✅ Workflow Completed");
}
