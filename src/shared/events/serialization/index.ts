export interface EventMetadata { readonly correlationId: string; readonly causationId: string; readonly actor: string; readonly timestamp: Date; }
export interface EventEnvelope<T> { readonly id: string; readonly type: string; readonly version: number; readonly payload: T; readonly metadata: EventMetadata; }
export interface PayloadMapper { map<TOut>(rawPayload: any): TOut; }
export interface EventSerializer { serialize<T>(envelope: EventEnvelope<T>): string; }
export interface EventDeserializer { deserialize<T>(data: string): EventEnvelope<T>; }
