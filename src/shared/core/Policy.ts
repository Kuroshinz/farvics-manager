export interface IPolicy<TCandidate, TContext = void> {
  isAllowed(candidate: TCandidate, context?: TContext): boolean;
}
