import {
  completeWorkflow,
  createWorkflow,
  getWorkflow,
  updateStep,
  updateContext,
  WorkflowContext,
} from "./workflow-state";

export interface WorkflowExecutionContext {
  workflowId: string;
  context: WorkflowContext;
}

export type WorkflowStep = (ctx: WorkflowExecutionContext) => Promise<void>;

export class WorkflowRunner {
  constructor(private readonly workflowId: string) {}

  async run(steps: WorkflowStep[]) {
    let workflow = await getWorkflow(this.workflowId);

    if (!workflow) {
      await createWorkflow(this.workflowId);
      workflow = await getWorkflow(this.workflowId);

      if (!workflow) {
        throw new Error("Failed to create workflow");
      }
    }

    const executionContext: WorkflowExecutionContext = {
      workflowId: this.workflowId,
      context: workflow.context,
    };

    console.log(
      `Resuming workflow ${this.workflowId} from step ${workflow.currentStep + 1}`,
    );

    for (let i = workflow.currentStep; i < steps.length; i++) {
      console.log(`Running Step ${i + 1}`);

      await steps[i](executionContext);

      await updateContext(this.workflowId, executionContext.context);

      await updateStep(this.workflowId, i + 1);
    }

    await completeWorkflow(this.workflowId);

    console.log("🎉 Workflow completed");
  }
}
