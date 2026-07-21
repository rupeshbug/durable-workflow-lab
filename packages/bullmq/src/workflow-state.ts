import { redis } from "./redis";

export interface WorkflowContext {
  searchQuery?: string;
  products?: string[];
}

export interface WorkflowState {
  workflowId: string;
  currentStep: number;
  status: "running" | "completed";
  context: WorkflowContext;
}

export async function createWorkflow(workflowId: string) {
  await redis.hset(`workflow:${workflowId}`, {
    workflowId,
    currentStep: "0",
    status: "running",
    context: JSON.stringify({}),
  });

  console.log(`📌 Created workflow ${workflowId}`);
}

export async function getWorkflow(
  workflowId: string,
): Promise<WorkflowState | null> {
  const workflow = await redis.hgetall(`workflow:${workflowId}`);

  if (Object.keys(workflow).length === 0) {
    return null;
  }

  return {
    workflowId: workflow.workflowId,
    currentStep: Number(workflow.currentStep),
    status: workflow.status as "running" | "completed",
    context: workflow.context ? JSON.parse(workflow.context) : {},
  };
}

export async function updateStep(workflowId: string, currentStep: number) {
  await redis.hset(
    `workflow:${workflowId}`,
    "currentStep",
    currentStep.toString(),
  );

  console.log(`💾 Checkpoint -> Step ${currentStep}`);
}

export async function updateContext(
  workflowId: string,
  context: WorkflowContext,
) {
  await redis.hset(
    `workflow:${workflowId}`,
    "context",
    JSON.stringify(context),
  );
}

export async function completeWorkflow(workflowId: string) {
  await redis.hset(`workflow:${workflowId}`, "status", "completed");

  console.log("✅ Workflow Completed");
}
