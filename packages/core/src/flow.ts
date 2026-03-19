export interface FlowContext {
  [key: string]: any;
}

export interface FlowStep<TContext extends FlowContext = FlowContext> {
  name: string;
  run: (ctx: TContext) => Promise<void> | void;
  rollback?: (ctx: TContext, error: Error) => Promise<void> | void;
}

export class Flow<TContext extends FlowContext = FlowContext> {
  private steps: FlowStep<TContext>[] = [];

  constructor(public name: string) {}

  addStep(step: FlowStep<TContext>) {
    this.steps.push(step);
    return this;
  }

  async execute(initialContext: Partial<TContext>): Promise<TContext> {
    const ctx = { ...initialContext } as TContext;
    const executedSteps: FlowStep<TContext>[] = [];

    for (const step of this.steps) {
      try {
        await step.run(ctx);
        executedSteps.push(step);
      } catch (error: any) {
        console.error(`Flow [${this.name}] failed at step [${step.name}]:`, error);

        // Rollback in reverse order
        for (const executedStep of executedSteps.reverse()) {
          if (executedStep.rollback) {
            try {
              await executedStep.rollback(ctx, error);
            } catch (rollbackError) {
              console.error(`Rollback failed for step [${executedStep.name}]:`, rollbackError);
            }
          }
        }

        throw error;
      }
    }

    return ctx;
  }
}

export function createFlow<TContext extends FlowContext>(name: string) {
  return new Flow<TContext>(name);
}
