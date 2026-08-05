export interface HashProvider { compute(data: string): string; }
export interface SignatureProvider { sign(data: string): string; verify(data: string, signature: string): boolean; }
export interface ChecksumStrategy { generateChecksum(payload: any): string; }
export interface EventIntegrityChecker { verify(envelope: any): boolean; }
export interface EventValidator { validatePayload(payload: any, schema: any): boolean; }
