export interface PostingStrategy { determinePostingSequence(context: any): void; }
export interface AllocationStrategy { allocate(total: number, weights: number[]): number[]; }
export interface DepreciationStrategy { calculateDepreciation(assetValue: number, periods: number): number; }
export interface ExchangeRateStrategy { resolveExchangeRate(base: string, quote: string, date: Date): number; }
export interface InterestCalculationStrategy { calculateInterest(principal: number, rate: number, periods: number): number; }
export interface RecurringExecutionStrategy { determineNextExecution(currentDate: Date, pattern: string): Date; }
export interface BudgetAllocationStrategy { distributeBudget(total: number, categories: string[]): Record<string, number>; }
