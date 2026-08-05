export interface EventVersion { readonly major: number; readonly minor: number; readonly patch: number; }
export interface VersionCompatibility { isCompatible(source: EventVersion, target: EventVersion): boolean; }
export interface VersionPolicy { enforce(version: EventVersion): void; }
export interface VersionResolver { resolveLatest(eventName: string): EventVersion; }
export interface VersionStrategy { determineVersion(eventPayload: any): EventVersion; }
