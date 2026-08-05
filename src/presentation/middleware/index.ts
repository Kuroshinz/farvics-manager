export interface GatewayContext {
  userId?: string;
  roles: string[];
  tenantId?: string;
  correlationId: string;
}

export class GatewayTelemetry {
  startSpan(name: string): number { return Date.now(); }
  endSpan(name: string, startTimeMs: number, context: GatewayContext): void { }
}

export class GatewayMetrics {
  recordCacheHit(queryName: string): void {}
  recordCacheMiss(queryName: string): void {}
  recordLatency(queryName: string, durationMs: number): void {}
}

export class GatewayAuthorization {
  authorize(context: GatewayContext, requiredRoles: string[]): boolean {
    if (requiredRoles.length === 0) return true;
    return requiredRoles.some(role => context.roles.includes(role));
  }
}

export class GatewayValidation {
  validatePayload<T>(payload: T): boolean {
    return payload !== undefined;
  }
}
