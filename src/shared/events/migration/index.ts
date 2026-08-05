export interface MigrationStep { readonly fromVersion: number; readonly toVersion: number; migrate(payload: any): any; }
export interface MigrationResult { readonly success: boolean; readonly migratedPayload?: any; readonly error?: string; }
export interface EventMigration { migrate(payload: any, targetVersion: number): MigrationResult; }
export interface MigrationRegistry { registerStep(eventName: string, step: MigrationStep): void; }
export interface MigrationValidator { validate(result: MigrationResult): boolean; }
