
import { IActionTelemetry, ActionContext } from './ApiCore';
export class ProductionTelemetry implements IActionTelemetry {
  start(actionName: string, context: ActionContext): void {
    console.log(`[TELEMETRY] ${actionName} started`, { correlationId: context.correlationId, userId: context.userId, tenantId: context.tenantId });
  }
  recordSuccess(actionName: string, durationMs: number): void {
    console.log(`[TELEMETRY] ${actionName} SUCCESS (${durationMs}ms)`);
  }
  recordFailure(actionName: string, error: unknown, durationMs: number): void {
    console.error(`[TELEMETRY] ${actionName} FAILURE (${durationMs}ms)`, error);
  }
}
