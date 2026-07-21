import {
  completeWorkflow,
  createWorkflow,
  getWorkflow,
  updateStep,
} from "./workflow-state";

export type WorkflowStep = () => Promise<void>;

export class WorkflowRunner {
  constructor(private readonly workflowId: string) {}

  async run(steps: WorkflowStep[]) {
    // 1. Load workflow state
    let workflow = await getWorkflow(this.workflowId);

    // 2. Create it if this is the first execution
    if (!workflow.workflowId) {
      await createWorkflow(this.workflowId);
      workflow = await getWorkflow(this.workflowId);
    }

    const currentStep = Number(workflow.currentStep);

    console.log(
      `📍 Resuming workflow ${this.workflowId} from step ${currentStep + 1}`,
    );

    // 3. Execute remaining steps
    for (let i = currentStep; i < steps.length; i++) {
      console.log(`▶️ Running Step ${i + 1}`);

      await steps[i]();

      // 4. Save checkpoint
      await updateStep(this.workflowId, i + 1);
    }

    // 5. Mark workflow complete
    await completeWorkflow(this.workflowId);

    console.log("🎉 Workflow completed");
  }
}
