import { Result, ErrorCode } from '../../core/Result';
import { ProblemDetails } from '../../core/Errors';

export class ProblemDetailsMapper {
  static mapError(error: unknown, correlationId: string): ProblemDetails {
    if (error instanceof Error) {
      return { code: ErrorCode.INFRASTRUCTURE_FAILURE, title: 'Server Error', detail: error.message, status: 500, correlationId };
    }
    return { code: ErrorCode.INFRASTRUCTURE_FAILURE, title: 'Unknown Error', detail: 'An unexpected error occurred', status: 500, correlationId };
  }

  static mapResultError(result: Result<unknown>, correlationId: string): ProblemDetails {
    const err = result.getError();
    return {
      code: err?.code || ErrorCode.INFRASTRUCTURE_FAILURE,
      title: 'Business Rule Violation',
      detail: err?.message || 'Action failed',
      status: err?.code === ErrorCode.VALIDATION_ERROR ? 400 : 422,
      correlationId
    };
  }
}

export class RequestMapper {
  static map<TOut>(raw: unknown): TOut { return raw as TOut; }
}

export class ResponseMapper {
  static map<TOut>(domainResult: unknown): TOut { return domainResult as TOut; }
}

export class ValidationExecutor {
  async validate<T>(dto: T): Promise<Result<void>> { return Result.ok(); }
}
