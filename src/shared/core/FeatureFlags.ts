export interface IFeatureFlags {
  isEnabled(flagName: string, context?: Record<string, unknown>): Promise<boolean>;
}
