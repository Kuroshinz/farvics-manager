import { ErrorCode } from './Result';

export interface ProblemDetails {
  code: string;
  title: string;
  detail: string;
  status: number;
  correlationId?: string;
}

export abstract class DomainError extends Error {
  public readonly code: ErrorCode;
  constructor(message: string, code: ErrorCode) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export interface IErrorFactory {
  createValidation(detail: string): DomainError;
  createBusinessRuleViolation(detail: string): DomainError;
  createUnauthorized(detail: string): DomainError;
  createForbidden(detail: string): DomainError;
  createNotFound(detail: string): DomainError;
  createConflict(detail: string): DomainError;
  createConcurrency(detail: string): DomainError;
  createInfrastructure(detail: string): DomainError;
}
