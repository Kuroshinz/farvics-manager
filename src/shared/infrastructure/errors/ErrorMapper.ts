import { ProblemDetails, DomainError } from '../../core/Errors';
import { ErrorCode } from '../../core/Result';

export class ErrorMapper {
  static toProblemDetails(error: Error | DomainError, correlationId?: string): ProblemDetails {
    if (error instanceof DomainError) {
      return {
        code: error.code,
        title: error.name,
        detail: error.message,
        status: this.mapCodeToStatus(error.code),
        correlationId
      };
    }
    
    return {
      code: ErrorCode.INFRASTRUCTURE_FAILURE,
      title: 'Internal Server Error',
      detail: 'An unexpected error occurred.',
      status: 500,
      correlationId
    };
  }

  private static mapCodeToStatus(code: ErrorCode): number {
    switch (code) {
      case ErrorCode.VALIDATION_ERROR: return 400;
      case ErrorCode.UNAUTHORIZED: return 401;
      case ErrorCode.FORBIDDEN: return 403;
      case ErrorCode.NOT_FOUND: return 404;
      case ErrorCode.CONFLICT: return 409;
      case ErrorCode.BUSINESS_RULE_VIOLATION: return 422;
      case ErrorCode.CONCURRENCY_ERROR: return 409;
      default: return 500;
    }
  }
}
