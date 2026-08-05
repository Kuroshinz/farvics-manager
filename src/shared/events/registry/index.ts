export interface EventDefinition { readonly name: string; readonly namespace: string; }
export interface EventDescriptor { readonly definition: EventDefinition; readonly version: number; readonly schema: any; }
export interface EventCatalog { listAll(): EventDescriptor[]; }
export interface EventLookup { findByName(name: string): EventDescriptor | null; }
export interface EventResolver { resolve(name: string, version: number): EventDescriptor | null; }
export interface EventRegistry { register(descriptor: EventDescriptor): void; getCatalog(): EventCatalog; getResolver(): EventResolver; }
