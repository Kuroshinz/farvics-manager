import { ProjectionBuilder } from '../../../modules/financial/projections/builders';

export class ProjectionRegistry {
  private builders = new Map<string, ProjectionBuilder<unknown>[]>();

  register(eventName: string, builder: ProjectionBuilder<unknown>): void {
    const existing = this.builders.get(eventName) || [];
    existing.push(builder);
    this.builders.set(eventName, existing);
  }

  getBuildersForEvent(eventName: string): ProjectionBuilder<unknown>[] {
    return this.builders.get(eventName) || [];
  }

  // Auto-discovery logic placeholder - dynamically finds and registers builders
  async discoverAndRegister(): Promise<void> {
    // Dynamically loading components based on metadata annotations or explicit exports
  }
}
