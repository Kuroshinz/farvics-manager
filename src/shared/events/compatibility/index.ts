export interface CompatibilityResult { readonly isCompatible: boolean; readonly errors: string[]; }
export interface EventCompatibility { check(sourceSchema: any, targetSchema: any): CompatibilityResult; }
export interface EventUpcaster { upcast(payload: any, fromVersion: number, toVersion: number): any; }
export interface EventDowncaster { downcast(payload: any, fromVersion: number, toVersion: number): any; }
export interface CompatibilityValidator { validateUpcast(payload: any, toVersion: number): boolean; }
