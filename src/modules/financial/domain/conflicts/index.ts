export enum ConflictResolutionResult {
  RESOLVED_CLIENT_WINS,
  RESOLVED_SERVER_WINS,
  RESOLVED_MERGED,
  UNRESOLVABLE
}

export interface MergePolicy<T> {
  merge(client: T, server: T): T;
}

export interface ConflictDetector<T> {
  hasConflict(clientVersion: number, serverVersion: number): boolean;
}

export interface IConflictResolver<T> {
  resolve(clientState: T, serverState: T, policy: MergePolicy<T>): ConflictResolutionResult;
}

export interface IVersionResolver {
  resolveVersion(current: number, expected: number): boolean;
}
