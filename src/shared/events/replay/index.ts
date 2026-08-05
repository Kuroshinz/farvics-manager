export interface ReplayCursor { readonly position: string; readonly timestamp: Date; }
export interface ReplayCheckpoint { readonly id: string; readonly cursor: ReplayCursor; readonly state: string; }
export interface ReplayContext { readonly sessionId: string; readonly actor: string; readonly startedAt: Date; }
export interface ReplayStatistics { readonly totalProcessed: number; readonly errors: number; readonly durationMs: number; }
export interface ReplayPolicy { canReplay(context: ReplayContext): boolean; }
export interface ReplayStrategy { execute(cursor: ReplayCursor): Promise<void>; }
export interface ReplayValidator { validateStateBeforeReplay(): boolean; }
export interface ReplaySession { 
  readonly context: ReplayContext; 
  start(cursor: ReplayCursor): Promise<void>; 
  stop(): Promise<void>; 
  getStatistics(): ReplayStatistics; 
}
