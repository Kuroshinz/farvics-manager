import { IMediator } from '../../shared/application/Pipeline';
import { DashboardAggregator, FinancialAggregator, ReportAggregator } from '../aggregation';
import { IQueryCache } from '../cache';
import { GatewayContext, GatewayAuthorization, GatewayMetrics, GatewayTelemetry } from '../middleware';

export abstract class QueryGateway {
  constructor(
    protected readonly mediator: IMediator,
    protected readonly cache: IQueryCache,
    protected readonly auth: GatewayAuthorization,
    protected readonly metrics: GatewayMetrics,
    protected readonly telemetry: GatewayTelemetry
  ) {}

  protected async executeCached<T>(
    key: string,
    tags: string[],
    context: GatewayContext,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const start = this.telemetry.startSpan(key);
    
    const cached = await this.cache.get<T>(key);
    if (cached) {
      this.metrics.recordCacheHit(key);
      this.telemetry.endSpan(key, start, context);
      return cached;
    }

    this.metrics.recordCacheMiss(key);
    const result = await fetcher();
    
    await this.cache.set(key, result, { ttlMs: 60000, tags });
    
    this.metrics.recordLatency(key, Date.now() - start);
    this.telemetry.endSpan(key, start, context);
    
    return result;
  }
}

export class DashboardGateway extends QueryGateway {
  private aggregator = new DashboardAggregator(this.mediator);

  async getDashboard(context: GatewayContext): Promise<unknown> {
    if (!this.auth.authorize(context, ['USER'])) throw new Error('Unauthorized');
    return this.executeCached(
      `dashboard_${context.userId}`,
      ['account_projection', 'budget_projection'],
      context,
      () => this.aggregator.getDashboard(context.userId || 'system')
    );
  }
}

export class FinancialGateway extends QueryGateway {
  private aggregator = new FinancialAggregator(this.mediator);

  async getOverview(context: GatewayContext): Promise<unknown> {
    return this.executeCached('financial_overview', ['category_projection'], context, () => this.aggregator.getFinancialOverview());
  }
}

export class IdentityGateway extends QueryGateway {
  async getProfile(context: GatewayContext): Promise<unknown> {
    return { id: context.userId, name: 'User' };
  }
}

export class ReportingGateway extends QueryGateway {
  private aggregator = new ReportAggregator(this.mediator);
  
  async getMonthly(context: GatewayContext): Promise<unknown> {
    return this.aggregator.getMonthlyReport();
  }
}

export class HealthGateway extends QueryGateway {
  async check(): Promise<unknown> {
    return { status: 'Healthy' };
  }
}
